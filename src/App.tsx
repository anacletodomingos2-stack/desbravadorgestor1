import { useState, useRef, useEffect, useCallback } from "react";
import type { Member, NavPage } from "./types";
import { emptyMember } from "./store";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MemberList from "./components/MemberList";
import MemberForm from "./components/MemberForm";
import MemberDetail from "./components/MemberDetail";
import Reports from "./components/Reports";
import AuditHistory from "./components/AuditHistory";
import { PrintFicha, PrintInscricao, PrintLista } from "./components/PrintTemplates";
import { PrintPreviewModal, PrintDocType } from "./components/PrintPreviewModal";
import { desbravadoresTriangleImg } from "./components/OfficialPdfIcons";
import {
  loadPortalMembers,
  savePortalMember,
  inactivatePortalMember,
  reactivatePortalMember,
  deletePortalMember,
} from "./services/portalService";
import { useAuth } from "./context/AuthContext";

function printEl(el: HTMLElement | null) {
  if (!el) return;
  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.zIndex = "99999";
  clone.classList.add("print-area");
  document.body.appendChild(clone);
  window.print();
  document.body.removeChild(clone);
}

export default function App() {
  const { user, token } = useAuth();
  const [page, setPage] = useState<NavPage>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    docType: PrintDocType;
    member: Member | null;
  }>({
    isOpen: false,
    docType: "ficha",
    member: null,
  });

  const openPrintModal = (docType: PrintDocType, member?: Member | null) => {
    setPrintModalState({
      isOpen: true,
      docType,
      member: member !== undefined ? member : (members[0] || null),
    });
  };

  const fichaRef = useRef<HTMLDivElement | null>(null);
  const inscricaoRef = useRef<HTMLDivElement | null>(null);
  const listaRef = useRef<HTMLDivElement | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const refreshData = async () => {
    setIsSyncing(true);
    try {
      const loadedMembers = await loadPortalMembers(token);
      setMembers(loadedMembers);
      return loadedMembers;
    } catch {
      // Ignored
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    refreshData().then((loaded) => {
      if (cancelled || !loaded) return;
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const navigate = (p: NavPage, id?: string) => {
    setPage(p);
    setSelectedId(id || null);
  };

  const handleSave = async (data: Omit<Member, "id"> & { id?: string }) => {
    const userName = user?.displayName || user?.email || "Administrador";
    const result = await savePortalMember(data, token, userName);
    if (!result.ok) {
      showToast(`${result.message} (Código: ${result.code})`, "error");
      return;
    }

    const { member: candidate } = result.data;
    if (data.id) {
      setMembers((prev) => prev.map((m) => (m.id === data.id ? candidate : m)));
      showToast(`Membro "${candidate.nomeCompleto}" atualizado com sucesso!`);
      navigate("detalhe", data.id);
    } else {
      setMembers((prev) => [...prev, candidate]);
      showToast(`Membro "${candidate.nomeCompleto}" cadastrado com sucesso (${candidate.id})!`);
      navigate("detalhe", candidate.id);
    }
  };

  const handleInactivate = async (id: string, reason?: string) => {
    try {
      const userName = user?.displayName || user?.email || "Administrador";
      const result = await inactivatePortalMember(id, reason, token, userName);
      if (!result.ok) {
        showToast(`${result.message} (${result.code})`, "error");
        return;
      }
      const updated = result.data.member;
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      showToast(`Membro "${updated.nomeCompleto}" inativado. Histórico preservado!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[handleInactivate] exceção:", err);
      showToast(`Falha ao inativar: ${msg}`, "error");
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      const userName = user?.displayName || user?.email || "Administrador";
      const result = await reactivatePortalMember(id, token, userName);
      if (!result.ok) {
        showToast(`${result.message} (${result.code})`, "error");
        return;
      }
      const updated = result.data.member;
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      showToast(`Membro "${updated.nomeCompleto}" reativado com sucesso!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[handleReactivate] exceção:", err);
      showToast(`Falha ao reativar: ${msg}`, "error");
    }
  };

  const handleToggle = async (id: string) => {
    const m = members.find((x) => x.id === id);
    if (m?.ativo) {
      await handleInactivate(id);
    } else {
      await handleReactivate(id);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    const memberName = members.find((m) => m.id === id)?.nomeCompleto || id;
    console.info(`[delete] pedido de eliminação de "${memberName}" (id=${id})`);
    setIsDeleting(id);
    try {
      const userName = user?.displayName || user?.email || "Administrador";
      const result = await deletePortalMember(id, token, userName);
      console.info("[delete] resposta do portalService:", result);

      if (!result.ok) {
        showToast(`${result.message} (${result.code})`, "error");
        return;
      }

      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast(`Membro "${memberName}" eliminado definitivamente da base de dados!`);
      if (page === "detalhe" || page === "editar") {
        navigate("membros");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[delete] exceção não capturada:", err);
      showToast(`Erro ao eliminar o membro: ${msg}`, "error");
    } finally {
      setIsDeleting(null);
    }
  }, [members, page, token, user]);

  const handleManualSync = async () => {
    await refreshData();
    showToast("Dados sincronizados com sucesso!");
  };

  const selectedMember = selectedId ? members.find((m) => m.id === selectedId) : null;

  const renderContent = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard members={members} onNav={navigate} />;
      case "membros":
        return (
          <>
            <MemberList
              members={members}
              onNav={navigate}
              onInactivate={handleInactivate}
              onReactivate={handleReactivate}
              onDeletePermanent={handleDelete}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onError={(msg) => showToast(msg, "error")}
              busyId={isDeleting}
              onPrintLista={() => openPrintModal("lista")}
            />
            <PrintLista members={members} ref={listaRef} />
          </>
        );
      case "cadastrar":
        return (
          <MemberForm
            key="novo-membro"
            initial={emptyMember()}
            onSave={handleSave}
            onCancel={() => navigate("membros")}
          />
        );
      case "editar":
        if (!selectedMember) return <div className="text-[#6B7A99]">Membro não encontrado.</div>;
        return (
          <MemberForm
            key={selectedMember.id}
            initial={selectedMember}
            onSave={handleSave}
            onCancel={() => navigate("detalhe", selectedId!)}
            isEdit
          />
        );
      case "detalhe":
        if (!selectedMember) return <div className="text-[#6B7A99]">Membro não encontrado.</div>;
        return (
          <>
            <MemberDetail
              member={selectedMember}
              onNav={navigate}
              onPrintFicha={() => openPrintModal("ficha", selectedMember)}
              onPrintInscricao={() => openPrintModal("inscricao", selectedMember)}
              onInactivate={handleInactivate}
              onReactivate={handleReactivate}
              onToggleStatus={handleToggle}
              onDeletePermanent={handleDelete}
            />
            <PrintFicha member={selectedMember} ref={fichaRef} />
            <PrintInscricao member={selectedMember} ref={inscricaoRef} />
          </>
        );
      case "relatorios":
        return <Reports members={members} onOpenPrint={openPrintModal} />;
      case "auditoria":
        return <AuditHistory onNav={navigate} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen" style={{ background: "#EEF1F8" }}>
      <Sidebar
        current={page}
        onNav={navigate}
        totalMembers={members.length}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border-b"
          style={{ background: "#fff", borderColor: "#E8ECF5" }}
        >
          <button
            className="lg:hidden flex items-center justify-center rounded-lg w-9 h-9 text-[#1B3A6B] hover:bg-[#EEF1F8] transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect y="3" width="18" height="2" rx="1" fill="currentColor" />
              <rect y="8" width="18" height="2" rx="1" fill="currentColor" />
              <rect y="13" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <img
              src={desbravadoresTriangleImg}
              alt=""
              className="w-5 h-5 object-contain shrink-0 hidden sm:block"
            />
            <p className="text-sm font-semibold text-[#1A2340] truncate">
              {page === "dashboard" && "Dashboard"}
              {page === "membros" && "Lista de Membros"}
              {page === "cadastrar" && "Novo Membro"}
              {page === "editar" && "Editar Membro"}
              {page === "detalhe" && (selectedMember?.nomeCompleto || "Perfil do Membro")}
              {page === "relatorios" && "Relatórios"}
              {page === "auditoria" && "Histórico de Auditoria"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sync button */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1B3A6B] border border-[#1B3A6B]/25 hover:bg-[#1B3A6B]/5 transition-colors disabled:opacity-50 cursor-pointer"
              title="Recarregar dados atualizados do backend"
            >
              <span className={isSyncing ? "animate-spin" : ""}>🔄</span>
              <span className="hidden sm:inline">Sincronizar</span>
            </button>

            {/* New Member button */}
            <button
              onClick={() => navigate("cadastrar")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: "#1B3A6B" }}
            >
              <span>+</span>
              <span className="hidden sm:inline">Novo Membro</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-5 py-6">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Official A4 Print & PDF Preview Modal */}
      <PrintPreviewModal
        isOpen={printModalState.isOpen}
        onClose={() => setPrintModalState((prev) => ({ ...prev, isOpen: false }))}
        initialDocType={printModalState.docType}
        member={printModalState.member}
        members={members}
        onSelectMember={(m) => setPrintModalState((prev) => ({ ...prev, member: m }))}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm bg-white text-[#1A2340]"
          style={{
            borderColor: toast.type === "error" ? "#F3B4AE" : "#E8ECF5",
            background: toast.type === "error" ? "#FDECEA" : "#fff",
          }}
        >
          <span className="text-base">{toast.type === "error" ? "⚠️" : "✅"}</span>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export type { InvestiduraClass, Member, AuditRecord, NavPage } from "./types";
