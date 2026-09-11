import React, { useState } from "react";
import { Printer, X, FileText, CheckCircle2, ChevronDown } from "lucide-react";
import type { Member } from "../types";
import { PrintFicha, PrintInscricao, PrintLista, A4Sheet } from "./PrintTemplates";
import { desbravadoresTriangleImg } from "./OfficialPdfIcons";

export type PrintDocType = "ficha" | "inscricao" | "lista";

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocType?: PrintDocType;
  member?: Member | null;
  members?: Member[];
  onSelectMember?: (member: Member) => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  initialDocType = "ficha",
  member,
  members = [],
  onSelectMember,
}) => {
  const [docType, setDocType] = useState<PrintDocType>(initialDocType);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(member?.id || (members[0]?.id ?? ""));

  if (!isOpen) return null;

  const currentMember =
    members.find((m) => m.id === selectedMemberId) || member || members[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/80 backdrop-blur-xs">
      {/* Modal Toolbar - Hidden during print */}
      <div className="flex-none bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-white/20 shadow-xs shrink-0">
            <img
              src={desbravadoresTriangleImg}
              alt="Desbravadores"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Emissão de Documentos Oficiais
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Padrão IASD
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Visualização e impressão nos moldes oficiais da Missão Norte / Ministério Jovem
            </p>
          </div>
        </div>

        {/* Center: Document Type Switcher */}
        <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setDocType("ficha")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              docType === "ficha"
                ? "bg-[#1B3A6B] text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Ficha de Desbravador
          </button>
          <button
            onClick={() => setDocType("inscricao")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              docType === "inscricao"
                ? "bg-[#1B3A6B] text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Ficha de Inscrição
          </button>
          <button
            onClick={() => setDocType("lista")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              docType === "lista"
                ? "bg-[#1B3A6B] text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Lista de Desbravadores
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Member Selector if multiple members */}
          {docType !== "lista" && members.length > 1 && (
            <div className="relative">
              <select
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  const found = members.find((m) => m.id === e.target.value);
                  if (found && onSelectMember) onSelectMember(found);
                }}
                className="text-xs bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-medium pr-7 appearance-none cursor-pointer focus:outline-hidden"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nomeCompleto}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Fechar Pré-visualização"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Doc Switcher */}
      <div className="sm:hidden flex items-center justify-around bg-slate-850 border-b border-slate-850 p-2 text-xs print:hidden">
        <button
          onClick={() => setDocType("ficha")}
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            docType === "ficha" ? "bg-[#1B3A6B] text-white" : "text-slate-300"
          }`}
        >
          Ficha Desbravador
        </button>
        <button
          onClick={() => setDocType("inscricao")}
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            docType === "inscricao" ? "bg-[#1B3A6B] text-white" : "text-slate-300"
          }`}
        >
          Ficha Inscrição
        </button>
        <button
          onClick={() => setDocType("lista")}
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            docType === "lista" ? "bg-[#1B3A6B] text-white" : "text-slate-300"
          }`}
        >
          Lista Geral
        </button>
      </div>

      {/* Sheet Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:m-0 print:overflow-visible">
        <div className="print-area shadow-2xl rounded-sm transition-all duration-200 print:shadow-none print:rounded-none">
          {docType === "ficha" && currentMember && (
            <A4FichaPreview member={currentMember} />
          )}

          {docType === "inscricao" && currentMember && (
            <A4InscricaoPreview member={currentMember} />
          )}

          {docType === "lista" && (
            <A4ListaPreview members={members} />
          )}

          {!currentMember && docType !== "lista" && (
            <div className="w-[210mm] min-h-[297mm] bg-white p-12 text-center text-slate-500">
              Nenhum membro selecionado para emissão.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
/* Preview Wrappers that render without -9999 offset   */
/* -------------------------------------------------- */
import { OfficialPrintHeader } from "./PrintTemplates";
import {
  DocCircleIcon,
  UserCircleIcon,
} from "./OfficialPdfIcons";
import { calcAge } from "../store";

function FormUnderlineView({
  children,
  minWidth = 80,
  flex = "1",
}: {
  children?: React.ReactNode;
  minWidth?: number | string;
  flex?: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        borderBottom: "1px solid #000000",
        minWidth: minWidth,
        flex: flex,
        fontSize: 10,
        fontWeight: 500,
        color: "#000000",
        padding: "0 4px",
        minHeight: 14,
        lineHeight: "14px",
        textAlign: "left",
      }}
    >
      {children || "\u00A0"}
    </span>
  );
}

function GreyPillView({
  children,
  width,
  height = 19,
  fontSize = 9.5,
  bold = true,
  align = "center",
}: {
  children?: React.ReactNode;
  width?: number | string;
  height?: number;
  fontSize?: number;
  bold?: boolean;
  align?: "left" | "center" | "right";
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent:
          align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        width: width,
        height: height,
        backgroundColor: "#d9d9d9",
        padding: "0 8px",
        borderRadius: 3,
        fontSize: fontSize,
        fontWeight: bold ? 700 : 500,
        color: "#000000",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children || "\u00A0"}
    </div>
  );
}

function A4FichaPreview({ member: m }: { member: Member }) {
  const age = calcAge(m.dataNascimento);

  const classesList = [
    { name: "Amigo" },
    { name: "Companheiro" },
    { name: "Pesquisador" },
    { name: "Pioneiro" },
    { name: "Excursionista" },
    { name: "Guia" },
    { name: "Líder" },
    { name: "Líder Master" },
    { name: "Líder Master Avançado" },
  ];

  const getInvestiture = (className: string) => {
    if (m.classeAtual === className) {
      return m.dataInvestidura || "";
    }
    const prev = m.classesAnteriores?.find(
      (c) => (c.classe || c.nome || "").toLowerCase() === className.toLowerCase()
    );
    if (prev) return prev.data || prev.dataConclusao || "Concluída";
    return "";
  };

  return (
    <A4Sheet>
      <OfficialPrintHeader showPhoto={true} memberPhoto={m.foto} />

      {/* Identifier Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 4,
          marginBottom: 12,
        }}
      >
        <DocCircleIcon size={24} />
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "0.2px",
          }}
        >
          NUMERO D IDENTIFICAÇÃO
        </span>
        <GreyPillView width={100} height={20} fontSize={10}>
          {m.numeroIdentificacao || m.id || "ID"}
        </GreyPillView>
      </div>

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: "0.5px",
          color: "#000000",
          marginBottom: 12,
        }}
      >
        FICHA DE DESBRAVADOR
      </div>

      {/* Personal Data Form Lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 10 }}>
        {/* Line 1 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Nome</span>
          <FormUnderlineView flex="1">{m.nomeCompleto}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 8 }}>
            sexo ( {m.sexo === "M" ? "✓" : "\u00A0"} )M ( {m.sexo === "F" ? "✓" : "\u00A0"} )F
          </span>
        </div>

        {/* Line 2 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Idade</span>
          <FormUnderlineView minWidth={45} flex="0 0 45px">
            {age > 0 ? age : ""}
          </FormUnderlineView>

          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Data de Nascimento
          </span>
          <FormUnderlineView minWidth={95} flex="0 0 95px">
            {m.dataNascimento}
          </FormUnderlineView>

          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Cédula / B.I nº
          </span>
          <FormUnderlineView flex="1">{m.cedula}</FormUnderlineView>
        </div>

        {/* Line 3 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Endereço</span>
          <FormUnderlineView flex="1">{m.endereco}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Bairro
          </span>
          <FormUnderlineView minWidth={160} flex="0 0 160px">
            {m.bairro}
          </FormUnderlineView>
        </div>

        {/* Line 4 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Município</span>
          <FormUnderlineView flex="1">{m.municipio}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Província
          </span>
          <FormUnderlineView minWidth={180} flex="0 0 180px">
            {m.provincia || "Luanda"}
          </FormUnderlineView>
        </div>

        {/* Line 5 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Escola:</span>
          <FormUnderlineView flex="1">{m.escola}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Classe
          </span>
          <FormUnderlineView minWidth={140} flex="0 0 140px">
            {m.classeEscolar || ""}
          </FormUnderlineView>
        </div>

        {/* Line 6 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Igreja</span>
          <FormUnderlineView flex="1">{m.igreja || "Central"}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Distrito
          </span>
          <FormUnderlineView minWidth={110} flex="0 0 110px">
            {m.distrito || ""}
          </FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Região
          </span>
          <FormUnderlineView minWidth={100} flex="0 0 100px">
            {m.regiao || ""}
          </FormUnderlineView>
        </div>

        {/* Line 7 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0" }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Unidade</span>
          <GreyPillView width={170} height={20} align="center">
            {m.unidade || "Nome da Unidade"}
          </GreyPillView>

          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 10 }}>
            Cargo
          </span>
          <GreyPillView width={170} height={20} align="center">
            {m.cargo || "Nome do Cargo"}
          </GreyPillView>
        </div>

        {/* Line 8 & 9 */}
        <div>
          <div style={{ fontWeight: 500, marginBottom: 3 }}>
            Nome dos Pais ou responsáveis
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
            <span style={{ fontWeight: 500 }}>1.</span>
            <FormUnderlineView flex="1">{m.nomeEncarregado1 || m.nomePai}</FormUnderlineView>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <span style={{ fontWeight: 500 }}>2.</span>
            <FormUnderlineView flex="1">{m.nomeEncarregado2 || m.nomeMae}</FormUnderlineView>
          </div>
        </div>

        {/* Line 10 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Contactos: Pai (+244)</span>
          <FormUnderlineView flex="1">{m.contatoPai || m.telefone}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Mãe(+244)
          </span>
          <FormUnderlineView flex="1">{m.contatoMae || ""}</FormUnderlineView>
        </div>

        {/* Line 11 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Email:</span>
          <FormUnderlineView flex="1">{m.email}</FormUnderlineView>
        </div>
      </div>

      {/* Baptism Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap" }}>
          Membro Baptizado
        </span>
        <GreyPillView width={140} height={20} fontSize={9.5}>
          {m.membroBaptizado ? m.numeroBaptismo || "Registado" : "Numero de Baptismo"}
        </GreyPillView>
        <GreyPillView width={130} height={20} fontSize={9.5}>
          {m.membroBaptizado ? m.dataBaptismo || "Data Registada" : "Data de Baptismo"}
        </GreyPillView>
      </div>

      {/* Current Class Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap" }}>
          Pertence à classe de:
        </span>
        <GreyPillView width={140} height={20} fontSize={9.5}>
          {m.classeAtual || m.classe || "Nome da Classe"}
        </GreyPillView>
        <GreyPillView width={130} height={20} fontSize={9.5}>
          {m.dataInvestidura || "Data de Investidura"}
        </GreyPillView>
      </div>

      {/* Historical Classes Box */}
      <div
        style={{
          border: "1.5px solid #000000",
          padding: "6px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {classesList.map((item, idx) => {
          const investDate = getInvestiture(item.name);
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 22,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#000000",
                  width: 220,
                }}
              >
                Já foi Investido na Classe de:
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <GreyPillView width={120} height={18} fontSize={9}>
                  {investDate ? item.name : "Nome da Classe"}
                </GreyPillView>
                <GreyPillView width={120} height={18} fontSize={9}>
                  {investDate || "Data de Investidura"}
                </GreyPillView>
              </div>
            </div>
          );
        })}
      </div>
    </A4Sheet>
  );
}

function A4InscricaoPreview({ member: m }: { member: Member }) {
  const age = calcAge(m.dataNascimento);
  const completedClasses = (m.classesAnteriores || []).map((c) => (c.classe || c.nome || "").toLowerCase());
  const isCompleted = (className: string) => {
    const target = className.toLowerCase();
    return (
      completedClasses.includes(target) ||
      (m.classeAtual || m.classe || "").toLowerCase() === target
    );
  };

  return (
    <A4Sheet>
      <OfficialPrintHeader showPhoto={true} memberPhoto={m.foto} />

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          fontSize: 13.5,
          fontWeight: 800,
          letterSpacing: "0.5px",
          color: "#000000",
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        FICHA DE INSCRIÇÃO
      </div>

      {/* Personal Data Form Lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 10 }}>
        {/* Line 1 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Nome</span>
          <FormUnderlineView flex="1">{m.nomeCompleto}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 8 }}>
            sexo ( {m.sexo === "M" ? "✓" : "\u00A0"} )M ( {m.sexo === "F" ? "✓" : "\u00A0"} )F
          </span>
        </div>

        {/* Line 2 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Idade</span>
          <FormUnderlineView minWidth={45} flex="0 0 45px">
            {age > 0 ? age : ""}
          </FormUnderlineView>

          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Data de Nascimento
          </span>
          <FormUnderlineView minWidth={95} flex="0 0 95px">
            {m.dataNascimento}
          </FormUnderlineView>

          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Cédula / B.I nº
          </span>
          <FormUnderlineView flex="1">{m.cedula}</FormUnderlineView>
        </div>

        {/* Line 3 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Endereço</span>
          <FormUnderlineView flex="1">{m.endereco}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Bairro
          </span>
          <FormUnderlineView minWidth={160} flex="0 0 160px">
            {m.bairro}
          </FormUnderlineView>
        </div>

        {/* Line 4 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Município</span>
          <FormUnderlineView flex="1">{m.municipio}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Província
          </span>
          <FormUnderlineView minWidth={180} flex="0 0 180px">
            {m.provincia || "Luanda"}
          </FormUnderlineView>
        </div>

        {/* Line 5 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Escola:</span>
          <FormUnderlineView flex="1">{m.escola}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Classe
          </span>
          <FormUnderlineView minWidth={140} flex="0 0 140px">
            {m.classeEscolar || ""}
          </FormUnderlineView>
        </div>

        {/* Line 6 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Igreja</span>
          <FormUnderlineView flex="1">{m.igreja || "Central"}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Distrito
          </span>
          <FormUnderlineView minWidth={110} flex="0 0 110px">
            {m.distrito || ""}
          </FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Região
          </span>
          <FormUnderlineView minWidth={100} flex="0 0 100px">
            {m.regiao || ""}
          </FormUnderlineView>
        </div>

        {/* Line 7 & 8 */}
        <div style={{ marginTop: 2 }}>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>
            Nome dos Pais ou responsáveis
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 3 }}>
            <span style={{ fontWeight: 500 }}>1.</span>
            <FormUnderlineView flex="1">{m.nomeEncarregado1 || m.nomePai}</FormUnderlineView>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <span style={{ fontWeight: 500 }}>2.</span>
            <FormUnderlineView flex="1">{m.nomeEncarregado2 || m.nomeMae}</FormUnderlineView>
          </div>
        </div>

        {/* Line 9 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Contactos: Pai (+244)</span>
          <FormUnderlineView flex="1">{m.contatoPai || m.telefone}</FormUnderlineView>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
            Mãe(+244)
          </span>
          <FormUnderlineView flex="1">{m.contatoMae || ""}</FormUnderlineView>
        </div>

        {/* Line 10 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
          <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Email:</span>
          <FormUnderlineView flex="1">{m.email}</FormUnderlineView>
        </div>
      </div>

      {/* Section: COMPROMISSO PESSOAL */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#000000", marginBottom: 3 }}>
          COMPROMISSO PESSOAL
        </div>
        <p
          style={{
            fontSize: 9.5,
            lineHeight: 1.35,
            color: "#000000",
            textAlign: "justify",
            marginBottom: 10,
          }}
        >
          Estou feliz em participar do clube dos Desbravadores, e assumo o compromisso de
          participar das reuniões, actividades, saídas e outras actividades que forem realizadas.
          Em tudo o que fizer vou demonstrar alegria, e ser puro, bondoso e leal.
        </p>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 500, whiteSpace: "nowrap" }}>
            Assinatura do Desbravador
          </span>
          <FormUnderlineView flex="1" />
        </div>

        <div style={{ fontSize: 9.5, fontWeight: 500, marginBottom: 3 }}>
          Já fui investido na classe de:
        </div>
        <div style={{ fontSize: 9, lineHeight: 1.6, color: "#000000" }}>
          <div>
            ( {isCompleted("Amigo") ? "✓" : "\u00A0"} ) Amigo &nbsp;&nbsp;
            ( {isCompleted("Companheiro") ? "✓" : "\u00A0"} ) Companheiro &nbsp;&nbsp;
            ( {isCompleted("Pesquisador") ? "✓" : "\u00A0"} ) Pesquisador &nbsp;&nbsp;
            ( {isCompleted("Pioneiro") ? "✓" : "\u00A0"} ) Pioneiro &nbsp;&nbsp;
            ( {isCompleted("Excursionista") ? "✓" : "\u00A0"} ) Excurcionista
          </div>
          <div>
            ( {isCompleted("Guia") ? "✓" : "\u00A0"} ) Guia &nbsp;&nbsp;
            ( {isCompleted("Líder") ? "✓" : "\u00A0"} ) Líder &nbsp;&nbsp;
            ( {isCompleted("Líder Master") ? "✓" : "\u00A0"} ) Líder Master &nbsp;&nbsp;
            ( {isCompleted("Líder Master Avançado") ? "✓" : "\u00A0"} ) Líder Master Avançado.
          </div>
        </div>
      </div>

      {/* Section: COMPROMISSO DOS PAI OU RESPONSÁVEIS */}
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#000000", marginBottom: 3 }}>
          COMPROMISSO DOS PAI OU RESPONSÁVEIS
        </div>
        <p
          style={{
            fontSize: 9.5,
            lineHeight: 1.35,
            color: "#000000",
            textAlign: "justify",
            marginBottom: 4,
          }}
        >
          Como pai/responsável, eu entendo que o Clube de Desbravadores é um programa que inclui
          muitas oportunidades para o serviço do Mestre, aventura, recreação e crescimento pessoal.
          Estou disposto(a) a apoiar o clube: encorajando o meu/minha Desbravador(a) a participar
          activamente das actividades e reuniões. Participando das actividades em que os pais forem
          envolvidos para apoiar o meu/minha Desbravador(a). Apoiar a liderança do clube ajudando em
          suas necessidades.
        </p>
        <p
          style={{
            fontSize: 9.5,
            lineHeight: 1.35,
            color: "#000000",
            textAlign: "justify",
            marginBottom: 10,
          }}
        >
          Dou a minha autorização para que o meu/minha Desbravador(a) participe de todas as
          actividades do Clube. Assumo a responsabilidade por incidentes ou acidentes que possam
          ocorrer.
        </p>

        {/* Date line */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 500 }}>Local</span>
          <FormUnderlineView minWidth={140} flex="0 0 140px">
            Luanda
          </FormUnderlineView>
          <span style={{ fontSize: 10, fontWeight: 500, marginLeft: 6 }}>aos</span>
          <FormUnderlineView minWidth={35} flex="0 0 35px" />
          <span style={{ fontSize: 10, fontWeight: 500 }}>de</span>
          <FormUnderlineView minWidth={90} flex="0 0 90px" />
          <span style={{ fontSize: 10, fontWeight: 500 }}>de</span>
          <FormUnderlineView minWidth={50} flex="0 0 50px">
            2026
          </FormUnderlineView>
        </div>

        {/* Signatures */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 3 }}>Assinaturas:</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 500 }}>1.</span>
            <FormUnderlineView flex="1" />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 500 }}>2.</span>
            <FormUnderlineView flex="1" />
          </div>
        </div>
      </div>
    </A4Sheet>
  );
}

function A4ListaPreview({ members }: { members: Member[] }) {
  const activeMembers = members.length > 0 ? members : [];

  return (
    <A4Sheet>
      <OfficialPrintHeader showPhoto={false} />

      {/* Total Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 6,
          marginBottom: 14,
        }}
      >
        <DocCircleIcon size={24} />
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "0.2px",
          }}
        >
          TOTAL DE DESBRAVADORES
        </span>
        <GreyPillView width={60} height={20} fontSize={10}>
          {activeMembers.length}
        </GreyPillView>
      </div>

      {/* Title */}
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: "0.5px",
          color: "#000000",
          marginBottom: 16,
        }}
      >
        LISTA DOS DESBRAVADORES
      </div>

      {/* Table Header Labels */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          fontSize: 10.5,
          fontWeight: 700,
          color: "#000000",
        }}
      >
        <div style={{ width: 32 }} />
        <div style={{ flex: "1 1 180px", textAlign: "center" }}>Nome completo</div>
        <div style={{ width: 55, textAlign: "center" }}>Idade</div>
        <div style={{ width: 55, textAlign: "center" }}>sexo</div>
        <div style={{ width: 85, textAlign: "center" }}>Classe</div>
        <div style={{ width: 95, textAlign: "center" }}>Unidade</div>
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeMembers.map((m) => {
          const age = calcAge(m.dataNascimento);
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 28,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#4f5d75",
                }}
              >
                {m.foto ? (
                  <img
                    src={m.foto}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <UserCircleIcon size={30} />
                )}
              </div>

              <div style={{ flex: "1 1 180px" }}>
                <GreyPillView width="100%" height={22} fontSize={9.5} align="left">
                  {m.nomeCompleto}
                </GreyPillView>
              </div>

              <div style={{ width: 55 }}>
                <GreyPillView width="100%" height={22} fontSize={9.5}>
                  {age > 0 ? age : "-"}
                </GreyPillView>
              </div>

              <div style={{ width: 55 }}>
                <GreyPillView width="100%" height={22} fontSize={9.5}>
                  {m.sexo || "-"}
                </GreyPillView>
              </div>

              <div style={{ width: 85 }}>
                <GreyPillView width="100%" height={22} fontSize={9}>
                  {m.classeAtual || m.classe || "-"}
                </GreyPillView>
              </div>

              <div style={{ width: 95 }}>
                <GreyPillView width="100%" height={22} fontSize={9}>
                  {m.unidade || "-"}
                </GreyPillView>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10mm",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#000000",
        }}
      >
        1 - 1
      </div>
    </A4Sheet>
  );
}
