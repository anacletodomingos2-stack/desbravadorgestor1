import React, { forwardRef } from "react";
import type { Member } from "../types";
import { calcAge } from "../store";
import {
  IasdLogo,
  DocCircleIcon,
  UserCircleIcon,
  PathfinderEmblem,
} from "./OfficialPdfIcons";

/* -------------------------------------------------- */
/* Official A4 Sheet Container                        */
/* Exact standard A4 dimensions with print margins     */
/* -------------------------------------------------- */
export function A4Sheet({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-white text-black font-sans relative ${className}`}
      style={{
        width: "210mm",
        minHeight: "296.8mm",
        maxWidth: "210mm",
        padding: "12mm 15mm",
        boxSizing: "border-box",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "'Inter', Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------- */
/* Official Header Component                          */
/* Recreating the exact IASD Missão Norte header      */
/* -------------------------------------------------- */
interface HeaderProps {
  showPhoto?: boolean;
  memberPhoto?: string | null;
}

export function OfficialPrintHeader({ showPhoto = false, memberPhoto }: HeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
        position: "relative",
      }}
    >
      {/* Left: IASD Church text and Green Ribbon */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#000000",
            lineHeight: 1.2,
          }}
        >
          Igreja Adventista do Sétimo Dia
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 12.5,
            fontWeight: 700,
            color: "#000000",
            lineHeight: 1.25,
          }}
        >
          Missão Norte
        </div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 12.5,
            fontWeight: 700,
            color: "#000000",
            lineHeight: 1.25,
          }}
        >
          Ministério Jovem
        </div>

        {/* Green Ribbon with Pathfinder Emblem */}
        <div
          style={{
            position: "relative",
            marginTop: 4,
            width: 320,
            maxWidth: "100%",
            height: 19,
            backgroundColor: "#4f8725",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 14,
          }}
        >
          {/* Pathfinder Emblem standing upright over the right end of the ribbon */}
          <div
            style={{
              position: "absolute",
              right: 24,
              top: -22,
              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
            }}
          >
            <PathfinderEmblem size={35} />
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2px",
              fontFamily: "'Inter', Arial, sans-serif",
            }}
          >
            Desbravadores
          </span>
        </div>
      </div>

      {/* Right: Optional Photo + Seventh-day Adventist Logo */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {showPhoto && (
          <div
            style={{
              width: 72,
              height: 88,
              border: "1.5px solid #000000",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {memberPhoto ? (
              <img
                src={memberPhoto}
                alt="Foto"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <UserCircleIcon size={58} />
            )}
          </div>
        )}

        {/* Official IASD Logo on right edge */}
        <div
          style={{
            width: 58,
            height: 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IasdLogo style={{ width: 56, height: 82 }} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* Reusable Underline Form Field Helpers               */
/* -------------------------------------------------- */
function FormUnderline({
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

function GreyPill({
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
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
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

/* -------------------------------------------------- */
/* DOCUMENT 1: FICHA DE DESBRAVADOR                   */
/* -------------------------------------------------- */
export const PrintFicha = forwardRef<HTMLDivElement, { member: Member }>(
  ({ member: m }, ref) => {
    const age = calcAge(m.dataNascimento);

    // 9 Pathfinder classes in canonical order
    const classesList = [
      { name: "Amigo", defaultInvest: "" },
      { name: "Companheiro", defaultInvest: "" },
      { name: "Pesquisador", defaultInvest: "" },
      { name: "Pioneiro", defaultInvest: "" },
      { name: "Excursionista", defaultInvest: "" },
      { name: "Guia", defaultInvest: "" },
      { name: "Líder", defaultInvest: "" },
      { name: "Líder Master", defaultInvest: "" },
      { name: "Líder Master Avançado", defaultInvest: "" },
    ];

    // Helper to find investiture info from member data
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
      <div
        ref={ref}
        className="print-area"
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          zIndex: -1,
        }}
      >
        <A4Sheet>
          {/* Header */}
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
            <GreyPill width={100} height={20} fontSize={10}>
              {m.numeroIdentificacao || m.id || "ID"}
            </GreyPill>
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
            {/* Line 1: Nome + Sexo */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Nome</span>
              <FormUnderline flex="1">{m.nomeCompleto}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 8 }}>
                sexo ( {m.sexo === "M" ? "✓" : "\u00A0"} )M ( {m.sexo === "F" ? "✓" : "\u00A0"} )F
              </span>
            </div>

            {/* Line 2: Idade + Data de Nascimento + Cédula/BI */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Idade</span>
              <FormUnderline minWidth={45} flex="0 0 45px">
                {age > 0 ? age : ""}
              </FormUnderline>

              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Data de Nascimento
              </span>
              <FormUnderline minWidth={95} flex="0 0 95px">
                {m.dataNascimento}
              </FormUnderline>

              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Cédula / B.I nº
              </span>
              <FormUnderline flex="1">{m.cedula}</FormUnderline>
            </div>

            {/* Line 3: Endereço + Bairro */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Endereço</span>
              <FormUnderline flex="1">{m.endereco}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Bairro
              </span>
              <FormUnderline minWidth={160} flex="0 0 160px">
                {m.bairro}
              </FormUnderline>
            </div>

            {/* Line 4: Município + Província */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Município</span>
              <FormUnderline flex="1">{m.municipio}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Província
              </span>
              <FormUnderline minWidth={180} flex="0 0 180px">
                {m.provincia || "Luanda"}
              </FormUnderline>
            </div>

            {/* Line 5: Escola + Classe */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Escola:</span>
              <FormUnderline flex="1">{m.escola}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Classe
              </span>
              <FormUnderline minWidth={140} flex="0 0 140px">
                {m.classeEscolar || ""}
              </FormUnderline>
            </div>

            {/* Line 6: Igreja + Distrito + Região */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Igreja</span>
              <FormUnderline flex="1">{m.igreja || "Central"}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Distrito
              </span>
              <FormUnderline minWidth={110} flex="0 0 110px">
                {m.distrito || ""}
              </FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Região
              </span>
              <FormUnderline minWidth={100} flex="0 0 100px">
                {m.regiao || ""}
              </FormUnderline>
            </div>

            {/* Line 7: Unidade + Cargo (displayed in grey rounded boxes) */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0" }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Unidade</span>
              <GreyPill width={170} height={20} align="center">
                {m.unidade || "Nome da Unidade"}
              </GreyPill>

              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 10 }}>
                Cargo
              </span>
              <GreyPill width={170} height={20} align="center">
                {m.cargo || "Nome do Cargo"}
              </GreyPill>
            </div>

            {/* Line 8 & 9: Nome dos Pais ou responsáveis */}
            <div>
              <div style={{ fontWeight: 500, marginBottom: 3 }}>
                Nome dos Pais ou responsáveis
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
                <span style={{ fontWeight: 500 }}>1.</span>
                <FormUnderline flex="1">{m.nomeEncarregado1 || m.nomePai}</FormUnderline>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                <span style={{ fontWeight: 500 }}>2.</span>
                <FormUnderline flex="1">{m.nomeEncarregado2 || m.nomeMae}</FormUnderline>
              </div>
            </div>

            {/* Line 10: Contactos */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Contactos: Pai (+244)</span>
              <FormUnderline flex="1">{m.contatoPai || m.telefone}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Mãe(+244)
              </span>
              <FormUnderline flex="1">{m.contatoMae || ""}</FormUnderline>
            </div>

            {/* Line 11: Email */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Email:</span>
              <FormUnderline flex="1">{m.email}</FormUnderline>
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
            <GreyPill width={140} height={20} fontSize={9.5}>
              {m.membroBaptizado ? m.numeroBaptismo || "Registado" : "Numero de Baptismo"}
            </GreyPill>
            <GreyPill width={130} height={20} fontSize={9.5}>
              {m.membroBaptizado ? m.dataBaptismo || "Data Registada" : "Data de Baptismo"}
            </GreyPill>
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
            <GreyPill width={140} height={20} fontSize={9.5}>
              {m.classeAtual || m.classe || "Nome da Classe"}
            </GreyPill>
            <GreyPill width={130} height={20} fontSize={9.5}>
              {m.dataInvestidura || "Data de Investidura"}
            </GreyPill>
          </div>

          {/* Historical Classes Box (Table with 9 rows) */}
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
                    <GreyPill width={120} height={18} fontSize={9}>
                      {investDate ? item.name : "Nome da Classe"}
                    </GreyPill>
                    <GreyPill width={120} height={18} fontSize={9}>
                      {investDate || "Data de Investidura"}
                    </GreyPill>
                  </div>
                </div>
              );
            })}
          </div>
        </A4Sheet>
      </div>
    );
  }
);

/* -------------------------------------------------- */
/* DOCUMENT 2: LISTA DOS DESBRAVADORES                */
/* -------------------------------------------------- */
export const PrintLista = forwardRef<HTMLDivElement, { members: Member[] }>(
  ({ members }, ref) => {
    // Up to 11-12 members per page for clean A4 printing
    const activeMembers = members.length > 0 ? members : [];

    return (
      <div
        ref={ref}
        className="print-area"
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          zIndex: -1,
        }}
      >
        <A4Sheet>
          {/* Header without single member photo */}
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
            <GreyPill width={60} height={20} fontSize={10}>
              {activeMembers.length}
            </GreyPill>
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
            <div style={{ width: 32 }} /> {/* Avatar column space */}
            <div style={{ flex: "1 1 180px", textAlign: "center" }}>Nome completo</div>
            <div style={{ width: 55, textAlign: "center" }}>Idade</div>
            <div style={{ width: 55, textAlign: "center" }}>sexo</div>
            <div style={{ width: 85, textAlign: "center" }}>Classe</div>
            <div style={{ width: 95, textAlign: "center" }}>Unidade</div>
          </div>

          {/* Member Rows */}
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
                  {/* Round Avatar (user photo or user.png silhouette) */}
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

                  {/* Nome Completo */}
                  <div style={{ flex: "1 1 180px" }}>
                    <GreyPill width="100%" height={22} fontSize={9.5} align="left">
                      {m.nomeCompleto}
                    </GreyPill>
                  </div>

                  {/* Idade */}
                  <div style={{ width: 55 }}>
                    <GreyPill width="100%" height={22} fontSize={9.5}>
                      {age > 0 ? age : "-"}
                    </GreyPill>
                  </div>

                  {/* Sexo */}
                  <div style={{ width: 55 }}>
                    <GreyPill width="100%" height={22} fontSize={9.5}>
                      {m.sexo || "-"}
                    </GreyPill>
                  </div>

                  {/* Classe */}
                  <div style={{ width: 85 }}>
                    <GreyPill width="100%" height={22} fontSize={9}>
                      {m.classeAtual || m.classe || "-"}
                    </GreyPill>
                  </div>

                  {/* Unidade */}
                  <div style={{ width: 95 }}>
                    <GreyPill width="100%" height={22} fontSize={9}>
                      {m.unidade || "-"}
                    </GreyPill>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page Footer */}
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
      </div>
    );
  }
);

/* -------------------------------------------------- */
/* DOCUMENT 3: FICHA DE INSCRIÇÃO                     */
/* -------------------------------------------------- */
export const PrintInscricao = forwardRef<HTMLDivElement, { member: Member }>(
  ({ member: m }, ref) => {
    const age = calcAge(m.dataNascimento);

    // Classes for investiture checklist
    const completedClasses = (m.classesAnteriores || []).map((c) => (c.classe || c.nome || "").toLowerCase());
    const isCompleted = (className: string) => {
      const target = className.toLowerCase();
      return (
        completedClasses.includes(target) ||
        (m.classeAtual || m.classe || "").toLowerCase() === target
      );
    };

    return (
      <div
        ref={ref}
        className="print-area"
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          zIndex: -1,
        }}
      >
        <A4Sheet>
          {/* Header */}
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
            {/* Line 1: Nome + Sexo */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Nome</span>
              <FormUnderline flex="1">{m.nomeCompleto}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 8 }}>
                sexo ( {m.sexo === "M" ? "✓" : "\u00A0"} )M ( {m.sexo === "F" ? "✓" : "\u00A0"} )F
              </span>
            </div>

            {/* Line 2: Idade + Data de Nascimento + Cédula/BI */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Idade</span>
              <FormUnderline minWidth={45} flex="0 0 45px">
                {age > 0 ? age : ""}
              </FormUnderline>

              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Data de Nascimento
              </span>
              <FormUnderline minWidth={95} flex="0 0 95px">
                {m.dataNascimento}
              </FormUnderline>

              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Cédula / B.I nº
              </span>
              <FormUnderline flex="1">{m.cedula}</FormUnderline>
            </div>

            {/* Line 3: Endereço + Bairro */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Endereço</span>
              <FormUnderline flex="1">{m.endereco}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Bairro
              </span>
              <FormUnderline minWidth={160} flex="0 0 160px">
                {m.bairro}
              </FormUnderline>
            </div>

            {/* Line 4: Município + Província */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Município</span>
              <FormUnderline flex="1">{m.municipio}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Província
              </span>
              <FormUnderline minWidth={180} flex="0 0 180px">
                {m.provincia || "Luanda"}
              </FormUnderline>
            </div>

            {/* Line 5: Escola + Classe */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Escola:</span>
              <FormUnderline flex="1">{m.escola}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Classe
              </span>
              <FormUnderline minWidth={140} flex="0 0 140px">
                {m.classeEscolar || ""}
              </FormUnderline>
            </div>

            {/* Line 6: Igreja + Distrito + Região */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Igreja</span>
              <FormUnderline flex="1">{m.igreja || "Central"}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Distrito
              </span>
              <FormUnderline minWidth={110} flex="0 0 110px">
                {m.distrito || ""}
              </FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Região
              </span>
              <FormUnderline minWidth={100} flex="0 0 100px">
                {m.regiao || ""}
              </FormUnderline>
            </div>

            {/* Line 7 & 8: Nome dos Pais ou responsáveis */}
            <div style={{ marginTop: 2 }}>
              <div style={{ fontWeight: 500, marginBottom: 2 }}>
                Nome dos Pais ou responsáveis
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 3 }}>
                <span style={{ fontWeight: 500 }}>1.</span>
                <FormUnderline flex="1">{m.nomeEncarregado1 || m.nomePai}</FormUnderline>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                <span style={{ fontWeight: 500 }}>2.</span>
                <FormUnderline flex="1">{m.nomeEncarregado2 || m.nomeMae}</FormUnderline>
              </div>
            </div>

            {/* Line 9: Contactos */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Contactos: Pai (+244)</span>
              <FormUnderline flex="1">{m.contatoPai || m.telefone}</FormUnderline>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap", marginLeft: 6 }}>
                Mãe(+244)
              </span>
              <FormUnderline flex="1">{m.contatoMae || ""}</FormUnderline>
            </div>

            {/* Line 10: Email */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
              <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>Email:</span>
              <FormUnderline flex="1">{m.email}</FormUnderline>
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
              <FormUnderline flex="1" />
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
              muitas oportunidades para o serviço do Mestre, aventura, recreação e crescimento
              pessoal. Estou disposto(a) a apoiar o clube: encorajando o meu/minha Desbravador(a) a
              participar activamente das actividades e reuniões. Participando das actividades em que os
              pais forem envolvidos para apoiar o meu/minha Desbravador(a). Apoiar a liderança do clube
              ajudando em suas necessidades.
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
              <FormUnderline minWidth={140} flex="0 0 140px">
                Luanda
              </FormUnderline>
              <span style={{ fontSize: 10, fontWeight: 500, marginLeft: 6 }}>aos</span>
              <FormUnderline minWidth={35} flex="0 0 35px" />
              <span style={{ fontSize: 10, fontWeight: 500 }}>de</span>
              <FormUnderline minWidth={90} flex="0 0 90px" />
              <span style={{ fontSize: 10, fontWeight: 500 }}>de</span>
              <FormUnderline minWidth={50} flex="0 0 50px">
                2026
              </FormUnderline>
            </div>

            {/* Signatures */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 3 }}>Assinaturas:</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 500 }}>1.</span>
                <FormUnderline flex="1" />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 500 }}>2.</span>
                <FormUnderline flex="1" />
              </div>
            </div>
          </div>
        </A4Sheet>
      </div>
    );
  }
);
