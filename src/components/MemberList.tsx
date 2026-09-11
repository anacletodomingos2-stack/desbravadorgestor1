import { useState } from "react";
import type { Member, NavPage } from "../types";
import { calcAge, CLASSES } from "../store";
import type { ConfirmActionType } from "./ConfirmModal";
import ConfirmModal from "./ConfirmModal";

interface MemberListProps {
  members: Member[];
  onNav: (p: NavPage, id?: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onInactivate?: (id: string, reason?: string) => void;
  onReactivate?: (id: string) => void;
  onDeletePermanent?: (id: string) => void;
  /** Feedback visível quando a operação falha (ex. setError/toast no parent). */
  onError?: (message: string) => void;
  /** id do membro cuja eliminação está em curso (desativa o botão e mostra "..."). */
  busyId?: string | null;
  onPrintLista?: () => void;
}

const CLOSE = { isOpen: false, type: "inactivate" as ConfirmActionType, member: null };

export default function MemberList({
  members,
  onNav,
  onInactivate,
  onReactivate,
  onDeletePermanent,
  onToggle,
  onDelete,
  onError,
  busyId,
  onPrintLista,
}: MemberListProps) {
  const [search, setSearch] = useState("");
  const [filterClasse, setFilterClasse] = useState("");
  const [filterUnidade, setFilterUnidade] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: ConfirmActionType;
    member: Member | null;
  }>(CLOSE);

  const handleConfirmAction = (payload?: { reason?: string }) => {
    const member = confirmModal.member;
    if (!member) return;
    const { id } = member;
    const type = confirmModal.type;

    try {
      if (type === "inactivate") {
        if (onInactivate) onInactivate(id, payload?.reason);
        else if (onToggle) onToggle(id);
        else throw new Error("Handler de inativação não configurado (onInactivate/onToggle).");
      } else if (type === "reactivate") {
        if (onReactivate) onReactivate(id);
        else if (onToggle) onToggle(id);
        else throw new Error("Handler de reativação não configurado (onReactivate/onToggle).");
      } else if (type === "delete") {
        // 1º onDeletePermanent (API DELETE -> DeletePermanentAsync), 2º onDelete (fallback)
        if (onDeletePermanent) onDeletePermanent(id);
        else if (onDelete) onDelete(id);
        else throw new Error("Handler de eliminação não configurado (onDeletePermanent/onDelete).");
      }
    } catch (err) {
      console.error("[MemberList] ação falhou:", type, id, err);
      onError?.(err instanceof Error ? err.message : "Erro ao executar a ação.");
    }

    setConfirmModal(CLOSE);
  };

  const unidades = Array.from(new Set(members.map((m) => m.unidade).filter(Boolean)));

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.nomeCompleto.toLowerCase().includes(q) ||
      m.telefone.includes(q) ||
      m.unidade.toLowerCase().includes(q) ||
      m.classe.toLowerCase().includes(q);
    const matchClasse = !filterClasse || m.classe === filterClasse;
    const matchUnidade = !filterUnidade || m.unidade === filterUnidade;
    const matchEstado =
      !filterEstado ||
      (filterEstado === "ativo" && m.ativo) ||
      (filterEstado === "inativo" && !m.ativo);
    return matchSearch && matchClasse && matchUnidade && matchEstado;
  });

  // Eliminação definitiva disponível? (evita botão morto)
  const canDelete = Boolean(onDeletePermanent ?? onDelete);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2340]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Membros
          </h1>
          <p className="text-[#6B7A99] text-sm">{filtered.length} de {members.length} membros</p>
        </div>
        <div className="flex items-center gap-2">
          {onPrintLista && (
            <button
              onClick={onPrintLista}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#1B3A6B] bg-white border border-[#1B3A6B]/30 hover:bg-[#1B3A6B]/5 transition-colors cursor-pointer"
              title="Imprimir Lista dos Desbravadores em formato A4"
            >
              <span>🖨️</span> Imprimir Lista
            </button>
          )}
          <button
            onClick={() => onNav("cadastrar")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: "#1B3A6B" }}
          >
            <span>+</span> Novo Membro
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8ECF5] flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Pesquisar por nome, telefone, unidade ou classe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] border border-[#C8D0E4] rounded-lg px-3 py-2 text-sm text-[#1A2340] placeholder-[#6B7A99] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
        />
        <select
          value={filterClasse}
          onChange={(e) => setFilterClasse(e.target.value)}
          className="border border-[#C8D0E4] rounded-lg px-3 py-2 text-sm text-[#1A2340] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white"
        >
          <option value="">Todas as classes</option>
          {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterUnidade}
          onChange={(e) => setFilterUnidade(e.target.value)}
          className="border border-[#C8D0E4] rounded-lg px-3 py-2 text-sm text-[#1A2340] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white"
        >
          <option value="">Todas as unidades</option>
          {unidades.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="border border-[#C8D0E4] rounded-lg px-3 py-2 text-sm text-[#1A2340] focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 bg-white"
        >
          <option value="">Todos os estados</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8ECF5] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#6B7A99]">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-medium">Nenhum membro encontrado</p>
            <p className="text-sm mt-1">
              {members.length === 0
                ? "Comece por cadastrar o primeiro membro."
                : "Tente ajustar os filtros de pesquisa."}
            </p>
            {members.length === 0 && (
              <button
                onClick={() => onNav("cadastrar")}
                className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ background: "#1B3A6B" }}
              >
                Cadastrar Membro
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EEF1F8]" style={{ background: "#F7F9FC" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide">Membro</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide hidden sm:table-cell">Idade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide hidden md:table-cell">Classe</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide hidden lg:table-cell">Unidade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide hidden lg:table-cell">Cargo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7A99] uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1F8]">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 rounded-full overflow-hidden bg-[#1B3A6B] flex items-center justify-center text-white font-bold text-sm"
                          style={{ width: 36, height: 36 }}
                        >
                          {m.foto
                            ? <img src={m.foto} alt="" className="w-full h-full object-cover" />
                            : m.nomeCompleto.charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-[#1A2340]">{m.nomeCompleto}</p>
                          <p className="text-xs text-[#6B7A99]">{m.telefone || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#1A2340] hidden sm:table-cell">
                      {calcAge(m.dataNascimento) > 0 ? calcAge(m.dataNascimento) + " anos" : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#1A2340] hidden md:table-cell">{m.classe || "—"}</td>
                    <td className="px-4 py-3 text-[#1A2340] hidden lg:table-cell">{m.unidade || "—"}</td>
                    <td className="px-4 py-3 text-[#1A2340] hidden lg:table-cell">{m.cargo || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={m.ativo
                          ? { background: "#E8F5E0", color: "#2E6B14" }
                          : { background: "#FDECEA", color: "#C62828" }
                        }
                      >
                        {m.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNav("detalhe", m.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium text-[#1B3A6B] border border-[#1B3A6B]/30 hover:bg-[#1B3A6B]/5 transition-colors cursor-pointer"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => onNav("editar", m.id)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium text-[#4A7C2F] border border-[#4A7C2F]/30 hover:bg-[#4A7C2F]/5 transition-colors cursor-pointer"
                        >
                          Editar
                        </button>
                        {m.ativo ? (
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, type: "inactivate", member: m })}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-[#E8A020] border border-[#E8A020]/40 hover:bg-[#FFF3E0] transition-colors cursor-pointer"
                            title="Inativar membro (preserva histórico)"
                          >
                            Inativar
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, type: "reactivate", member: m })}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-[#2E6B14] border border-[#2E6B14]/40 hover:bg-[#E8F5E0] transition-colors cursor-pointer"
                            title="Reativar membro no clube"
                          >
                            Reativar
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={!canDelete || busyId === m.id}
                          onClick={() => setConfirmModal({ isOpen: true, type: "delete", member: m })}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          style={{ background: "#C62828" }}
                          title={
                            canDelete
                              ? "Eliminar definitivamente da base de dados (irreversível)"
                              : "Ação de eliminação não está ligada ao componente pai"
                          }
                        >
                          {busyId === m.id ? "A eliminar..." : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.member && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          type={confirmModal.type}
          member={confirmModal.member}
          onClose={() => setConfirmModal(CLOSE)}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}
