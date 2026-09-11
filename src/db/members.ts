import { db } from './index';
import { members, auditLogs } from './schema';
import { Member, AuditRecord } from '../types';
import { desc, eq } from 'drizzle-orm';

export async function getMembersFromDb(): Promise<Member[]> {
  try {
    const rows = await db.select().from(members).orderBy(desc(members.createdAt));
    return rows.map((r) => ({
      id: r.id,
      foto: r.foto || undefined,
      nomeCompleto: r.nomeCompleto,
      dataNascimento: r.dataNascimento,
      sexo: r.sexo as any,
      telefone: r.telefone,
      endereco: r.endereco,
      bairro: r.bairro,
      municipio: r.municipio,
      provincia: r.provincia,
      escola: r.escola,
      classeEscolar: r.classeEscolar || undefined,
      igreja: r.igreja,
      distrito: r.distrito,
      regiao: r.regiao,
      cedula: r.cedula,
      nomeEncarregado1: r.nomeEncarregado1,
      nomeEncarregado2: r.nomeEncarregado2,
      nomePai: r.nomePai || undefined,
      nomeMae: r.nomeMae || undefined,
      contatoPai: r.contatoPai,
      contatoMae: r.contatoMae,
      email: r.email,
      classe: r.classe,
      unidade: r.unidade,
      cargo: r.cargo,
      dataEntrada: r.dataEntrada,
      ativo: r.ativo,
      observacoes: r.observacoes,
      membroBaptizado: r.membroBaptizado,
      numeroBaptismo: r.numeroBaptismo,
      dataBaptismo: r.dataBaptismo,
      classeAtual: r.classeAtual,
      dataInvestidura: r.dataInvestidura,
      classesAnteriores: (r.classesAnteriores as any) || [],
      numeroIdentificacao: r.numeroIdentificacao,
    }));
  } catch (error) {
    console.error('Error fetching members from DB:', error);
    throw new Error('Database query failed: ' + String(error));
  }
}

export async function saveMemberToDb(member: Member, userId?: string): Promise<Member> {
  try {
    await db.insert(members)
      .values({
        id: member.id,
        userId: userId || null,
        foto: member.foto || null,
        nomeCompleto: member.nomeCompleto,
        dataNascimento: member.dataNascimento,
        sexo: member.sexo,
        telefone: member.telefone,
        endereco: member.endereco,
        bairro: member.bairro,
        municipio: member.municipio,
        provincia: member.provincia,
        escola: member.escola,
        classeEscolar: member.classeEscolar || null,
        igreja: member.igreja,
        distrito: member.distrito,
        regiao: member.regiao,
        cedula: member.cedula,
        nomeEncarregado1: member.nomeEncarregado1,
        nomeEncarregado2: member.nomeEncarregado2,
        nomePai: member.nomePai || null,
        nomeMae: member.nomeMae || null,
        contatoPai: member.contatoPai,
        contatoMae: member.contatoMae,
        email: member.email,
        classe: member.classe,
        unidade: member.unidade,
        cargo: member.cargo,
        dataEntrada: member.dataEntrada,
        ativo: member.ativo,
        observacoes: member.observacoes,
        membroBaptizado: member.membroBaptizado,
        numeroBaptismo: member.numeroBaptismo,
        dataBaptismo: member.dataBaptismo,
        classeAtual: member.classeAtual,
        dataInvestidura: member.dataInvestidura,
        classesAnteriores: member.classesAnteriores || [],
        numeroIdentificacao: member.numeroIdentificacao || member.id,
      })
      .onConflictDoUpdate({
        target: members.id,
        set: {
          foto: member.foto || null,
          nomeCompleto: member.nomeCompleto,
          dataNascimento: member.dataNascimento,
          sexo: member.sexo,
          telefone: member.telefone,
          endereco: member.endereco,
          bairro: member.bairro,
          municipio: member.municipio,
          provincia: member.provincia,
          escola: member.escola,
          classeEscolar: member.classeEscolar || null,
          igreja: member.igreja,
          distrito: member.distrito,
          regiao: member.regiao,
          cedula: member.cedula,
          nomeEncarregado1: member.nomeEncarregado1,
          nomeEncarregado2: member.nomeEncarregado2,
          nomePai: member.nomePai || null,
          nomeMae: member.nomeMae || null,
          contatoPai: member.contatoPai,
          contatoMae: member.contatoMae,
          email: member.email,
          classe: member.classe,
          unidade: member.unidade,
          cargo: member.cargo,
          dataEntrada: member.dataEntrada,
          ativo: member.ativo,
          observacoes: member.observacoes,
          membroBaptizado: member.membroBaptizado,
          numeroBaptismo: member.numeroBaptismo,
          dataBaptismo: member.dataBaptismo,
          classeAtual: member.classeAtual,
          dataInvestidura: member.dataInvestidura,
          classesAnteriores: member.classesAnteriores || [],
          numeroIdentificacao: member.numeroIdentificacao || member.id,
          updatedAt: new Date(),
        },
      });

    return member;
  } catch (error) {
    console.error('Error saving member to DB:', error);
    throw new Error('Failed to save member in database: ' + String(error));
  }
}

export async function deleteMemberFromDb(memberId: string): Promise<boolean> {
  try {
    await db.delete(members).where(eq(members.id, memberId));
    return true;
  } catch (error) {
    console.error('Error deleting member from DB:', error);
    throw new Error('Failed to delete member: ' + String(error));
  }
}

export async function getAuditLogsFromDb(): Promise<AuditRecord[]> {
  try {
    const rows = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
    return rows.map((r) => ({
      id: r.id,
      date: r.date,
      user: r.user,
      operation: r.operation,
      entity: r.entity,
      entityId: r.entityId,
      previousValueJson: r.previousValueJson || undefined,
      newValueJson: r.newValueJson || undefined,
      origin: r.origin,
    }));
  } catch (error) {
    console.error('Error fetching audit logs from DB:', error);
    throw new Error('Database query failed: ' + String(error));
  }
}

export async function saveAuditLogToDb(log: AuditRecord, userId?: string): Promise<AuditRecord> {
  try {
    await db.insert(auditLogs).values({
      id: log.id,
      userId: userId || null,
      date: log.date,
      user: log.user,
      operation: log.operation,
      entity: log.entity,
      entityId: log.entityId,
      previousValueJson: log.previousValueJson || null,
      newValueJson: log.newValueJson || null,
      origin: log.origin || 'Sistema',
    });
    return log;
  } catch (error) {
    console.error('Error saving audit log to DB:', error);
    throw new Error('Failed to save audit log: ' + String(error));
  }
}
