import { Member, AuditRecord } from '../types';
import { INITIAL_MEMBERS, INITIAL_AUDIT_LOGS } from '../store';

const STORAGE_KEY_MEMBERS = 'desbravador_portal_members_v1';
const STORAGE_KEY_AUDIT = 'desbravador_portal_audit_v1';

function getStoredMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[portalService] Error reading localStorage members, using defaults:', err);
    return INITIAL_MEMBERS;
  }
}

function saveStoredMembers(members: Member[]) {
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  } catch (err) {
    console.error('[portalService] Error saving members to localStorage:', err);
  }
}

export function getStoredAuditRecords(): AuditRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[portalService] Error reading audit logs:', err);
    return INITIAL_AUDIT_LOGS;
  }
}

export function saveStoredAuditRecords(records: AuditRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(records));
  } catch (e) {
    console.error('[portalService] Error saving audit records:', e);
  }
}

export async function addAuditRecord(
  operation: 'CREATE' | 'UPDATE' | 'STATUS' | 'DELETE' | string,
  entityId: string,
  previousValue?: unknown,
  newValue?: unknown,
  user = 'Administrador',
  token?: string | null
) {
  try {
    const records = getStoredAuditRecords();
    const newRecord: AuditRecord = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user,
      operation,
      entity: 'Member',
      entityId,
      previousValueJson: previousValue ? JSON.stringify(previousValue) : undefined,
      newValueJson: newValue ? JSON.stringify(newValue) : undefined,
      origin: 'Portal Web Desbravador',
    };
    records.unshift(newRecord);
    saveStoredAuditRecords(records);

    // Save to Cloud SQL
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/audit', {
      method: 'POST',
      headers,
      body: JSON.stringify(newRecord),
    }).catch(() => {});
  } catch (e) {
    console.error('[portalService] Could not write audit record:', e);
  }
}

export async function checkBackendStatus(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('/api/health', {
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);
    return Boolean(res && res.ok);
  } catch {
    return false;
  }
}

/**
 * Loads members from Cloud SQL backend if available, syncing with local storage
 */
export async function loadPortalMembers(token?: string | null): Promise<Member[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/members', {
      headers,
      signal: controller.signal,
    }).catch(() => null);
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveStoredMembers(data);
        return data;
      }
    }
  } catch (err) {
    console.info('[portalService] Cloud SQL load bypassed, using local store:', err);
  }

  // Fallback to local storage (or seed initial members to Cloud SQL)
  const local = getStoredMembers();
  if (local.length > 0) {
    // Background seed to Cloud SQL if empty
    fetch('/api/members')
      .then((r) => r.json())
      .then((serverMembers) => {
        if (Array.isArray(serverMembers) && serverMembers.length === 0) {
          for (const m of local) {
            fetch('/api/members', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(m),
            }).catch(() => {});
          }
        }
      })
      .catch(() => {});
  }

  return local;
}

export async function loadAuditLogs(token?: string | null): Promise<AuditRecord[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/audit', { headers }).catch(() => null);
    if (res && res.ok) {
      const logs = await res.json();
      if (Array.isArray(logs) && logs.length > 0) {
        saveStoredAuditRecords(logs);
        return logs;
      }
    }
  } catch (e) {
    console.info('[portalService] Failed to load audit logs from DB:', e);
  }
  return getStoredAuditRecords();
}

export interface ServiceResult<T> {
  ok: boolean;
  data: T;
  message: string;
  code: string;
}

/**
 * Saves or updates a member in Cloud SQL and local store
 */
export async function savePortalMember(
  data: Omit<Member, 'id'> & { id?: string },
  token?: string | null,
  userName = 'Administrador'
): Promise<ServiceResult<{ member: Member }>> {
  try {
    if (!data.nomeCompleto || !data.nomeCompleto.trim()) {
      return {
        ok: false,
        data: { member: data as Member },
        message: 'O nome completo do desbravador é obrigatório',
        code: 'VALIDATION_ERROR',
      };
    }

    const currentMembers = getStoredMembers();
    let savedMember: Member;
    const isUpdate = Boolean(data.id && currentMembers.some((m) => m.id === data.id));

    if (isUpdate && data.id) {
      const prevIndex = currentMembers.findIndex((m) => m.id === data.id);
      const previousMember = currentMembers[prevIndex];
      savedMember = {
        ...previousMember,
        ...data,
        id: data.id,
        numeroIdentificacao: data.numeroIdentificacao || data.id,
      };
      currentMembers[prevIndex] = savedMember;

      addAuditRecord('UPDATE', data.id, previousMember, savedMember, userName, token);
    } else {
      const generatedId = `DBV-${new Date().getFullYear()}-${String(currentMembers.length + 1).padStart(3, '0')}`;
      savedMember = {
        ...data,
        id: generatedId,
        numeroIdentificacao: data.numeroIdentificacao || generatedId,
        ativo: data.ativo ?? true,
      } as Member;
      currentMembers.push(savedMember);

      addAuditRecord('CREATE', generatedId, undefined, savedMember, userName, token);
    }

    saveStoredMembers(currentMembers);

    // Sync to Cloud SQL via API
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const apiRes = await fetch(isUpdate ? `/api/members/${savedMember.id}` : '/api/members', {
        method: isUpdate ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(savedMember),
      });

      if (apiRes.ok) {
        const fromDb = await apiRes.json();
        return {
          ok: true,
          data: { member: fromDb || savedMember },
          message: isUpdate ? 'Membro atualizado no banco de dados' : 'Membro cadastrado no banco de dados',
          code: 'OK',
        };
      }
    } catch (apiErr) {
      console.warn('API sync warning:', apiErr);
    }

    return {
      ok: true,
      data: { member: savedMember },
      message: isUpdate ? 'Membro atualizado com sucesso' : 'Membro cadastrado com sucesso',
      code: 'OK',
    };
  } catch (err) {
    return {
      ok: false,
      data: { member: data as Member },
      message: err instanceof Error ? err.message : 'Erro interno ao salvar membro',
      code: 'INTERNAL_ERROR',
    };
  }
}

/**
 * Inactivate a member
 */
export async function inactivatePortalMember(
  id: string,
  reason?: string,
  token?: string | null,
  userName = 'Administrador'
): Promise<ServiceResult<{ member: Member }>> {
  const members = getStoredMembers();
  const index = members.findIndex((m) => m.id === id);

  if (index === -1) {
    return {
      ok: false,
      data: { member: {} as Member },
      message: 'Membro não encontrado',
      code: 'NOT_FOUND',
    };
  }

  const prev = members[index];
  const updated: Member = {
    ...prev,
    ativo: false,
    observacoes: reason ? `${prev.observacoes || ''} [Inativado: ${reason}]`.trim() : prev.observacoes,
  };

  members[index] = updated;
  saveStoredMembers(members);
  addAuditRecord('STATUS', id, { ativo: true }, { ativo: false, reason }, userName, token);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  fetch(`/api/members/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updated),
  }).catch(() => {});

  return {
    ok: true,
    data: { member: updated },
    message: 'Membro inativado com sucesso',
    code: 'OK',
  };
}

/**
 * Reactivate a member
 */
export async function reactivatePortalMember(
  id: string,
  token?: string | null,
  userName = 'Administrador'
): Promise<ServiceResult<{ member: Member }>> {
  const members = getStoredMembers();
  const index = members.findIndex((m) => m.id === id);

  if (index === -1) {
    return {
      ok: false,
      data: { member: {} as Member },
      message: 'Membro não encontrado',
      code: 'NOT_FOUND',
    };
  }

  const prev = members[index];
  const updated: Member = {
    ...prev,
    ativo: true,
  };

  members[index] = updated;
  saveStoredMembers(members);
  addAuditRecord('STATUS', id, { ativo: false }, { ativo: true }, userName, token);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  fetch(`/api/members/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updated),
  }).catch(() => {});

  return {
    ok: true,
    data: { member: updated },
    message: 'Membro reativado com sucesso',
    code: 'OK',
  };
}

/**
 * Permanently delete a member
 */
export async function deletePortalMember(
  id: string,
  token?: string | null,
  userName = 'Administrador'
): Promise<{ ok: boolean; message: string; code: string }> {
  const members = getStoredMembers();
  const target = members.find((m) => m.id === id);

  if (!target) {
    return {
      ok: false,
      message: 'Membro não encontrado para eliminação',
      code: 'NOT_FOUND',
    };
  }

  const filtered = members.filter((m) => m.id !== id);
  saveStoredMembers(filtered);
  addAuditRecord('DELETE', id, target, undefined, userName, token);

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  fetch(`/api/members/${id}`, {
    method: 'DELETE',
    headers,
  }).catch(() => {});

  return {
    ok: true,
    message: 'Membro eliminado definitivamente',
    code: 'OK',
  };
}
