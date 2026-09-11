import React, { useState } from 'react';
import { Member } from '../types';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Users,
  Droplets,
  Layers,
  Award,
  Cake,
  CheckCircle,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface ReportsProps {
  members: Member[];
  onOpenPrint?: (docType: 'ficha' | 'inscricao' | 'lista', member?: Member | null) => void;
}

export const Reports: React.FC<ReportsProps> = ({ members, onOpenPrint }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedPrintMemberId, setSelectedPrintMemberId] = useState<string>(members[0]?.id || '');

  // Stats
  const total = members.length;
  const activeCount = members.filter((m) => m.ativo).length;
  const maleCount = members.filter((m) => m.sexo === 'M').length;
  const femaleCount = members.filter((m) => m.sexo === 'F').length;
  const baptizedCount = members.filter((m) => m.membroBaptizado).length;

  // Birthdays of selected month
  const birthdayMembers = members.filter((m) => {
    if (!m.dataNascimento) return false;
    const parts = m.dataNascimento.split('-');
    if (parts.length >= 2) {
      return parseInt(parts[1], 10) === selectedMonth;
    }
    return false;
  });

  // Class breakdown
  const classOrder = ['Amigo', 'Companheiro', 'Pesquisador', 'Pioneiro', 'Excursionista', 'Guia', 'Líder', 'Líder Master'];
  const classBreakdown = classOrder.map((cls) => {
    const matching = members.filter((m) => (m.classeAtual || m.classe) === cls);
    return {
      name: cls,
      count: matching.length,
      active: matching.filter((m) => m.ativo).length,
    };
  });

  // Unit breakdown
  const unitStats: Record<string, { total: number; active: number }> = {};
  members.forEach((m) => {
    const unit = m.unidade || 'Sem Unidade';
    if (!unitStats[unit]) {
      unitStats[unit] = { total: 0, active: 0 };
    }
    unitStats[unit].total += 1;
    if (m.ativo) unitStats[unit].active += 1;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nome Completo',
      'Sexo',
      'Data Nascimento',
      'Telefone',
      'Email',
      'Cédula',
      'Encarregado 1',
      'Contato Encarregado 1',
      'Encarregado 2',
      'Contato Encarregado 2',
      'Endereço',
      'Bairro',
      'Município',
      'Classe Atual',
      'Unidade',
      'Cargo',
      'Data Admissão',
      'Ativo',
      'Batizado',
      'Data Batismo',
    ];

    const rows = members.map((m) => [
      `"${m.numeroIdentificacao || m.id}"`,
      `"${m.nomeCompleto}"`,
      `"${m.sexo}"`,
      `"${m.dataNascimento}"`,
      `"${m.telefone}"`,
      `"${m.email}"`,
      `"${m.cedula}"`,
      `"${m.nomeEncarregado1}"`,
      `"${m.contatoPai}"`,
      `"${m.nomeEncarregado2}"`,
      `"${m.contatoMae}"`,
      `"${m.endereco}"`,
      `"${m.bairro}"`,
      `"${m.municipio}"`,
      `"${m.classeAtual || m.classe}"`,
      `"${m.unidade}"`,
      `"${m.cargo}"`,
      `"${m.dataEntrada}"`,
      `"${m.ativo ? 'SIM' : 'NÃO'}"`,
      `"${m.membroBaptizado ? 'SIM' : 'NÃO'}"`,
      `"${m.dataBaptismo}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `relatorio_desbravadores_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(members, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute(
      'download',
      `backup_desbravadores_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1B3A6B]" />
            Relatórios & Exportação de Dados
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Estatísticas demográficas, aniversariantes e exportação de dados para a secretaria
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Exportar CSV (Excel)
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Backup JSON
          </button>
        </div>
      </div>

      {/* Official A4 Documents Emission Banner */}
      {onOpenPrint && (
        <div className="bg-gradient-to-r from-[#1B3A6B] to-[#254b85] rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#4f8725] text-white text-[10px] font-extrabold uppercase tracking-wide">
                Missão Norte &bull; A4 Oficial
              </span>
              <span className="text-xs text-blue-200 font-medium">Modelos Oficiais Ministério Jovem</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Emissão e Impressão de Fichas & Listas em PDF
            </h3>
            <p className="text-xs text-blue-100/80 max-w-xl">
              Gere os documentos oficiais padronizados para arquivo, investiduras e secretaria do clube.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenPrint('lista')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1B3A6B] bg-white hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
              title="Emitir Lista Completa de Desbravadores"
            >
              <Printer className="w-3.5 h-3.5 text-[#1B3A6B]" />
              Lista Geral (A4)
            </button>

            {members.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/20">
                <select
                  value={selectedPrintMemberId}
                  onChange={(e) => setSelectedPrintMemberId(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold px-2 py-1 focus:outline-hidden cursor-pointer"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="text-slate-900">
                      {m.nomeCompleto}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const chosen = members.find((m) => m.id === selectedPrintMemberId) || members[0];
                    onOpenPrint('ficha', chosen);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#4f8725] hover:bg-[#43751f] transition-colors cursor-pointer"
                  title="Ficha do Desbravador Selecionado"
                >
                  Ficha
                </button>

                <button
                  onClick={() => {
                    const chosen = members.find((m) => m.id === selectedPrintMemberId) || members[0];
                    onOpenPrint('inscricao', chosen);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                  title="Ficha de Inscrição Selecionado"
                >
                  Inscrição
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-medium block mb-1">Membros Cadastrados</span>
          <span className="text-2xl font-black text-slate-900">{total}</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            {activeCount} Ativos ({total > 0 ? Math.round((activeCount / total) * 100) : 0}%)
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-medium block mb-1">Distribuição por Sexo</span>
          <span className="text-lg font-black text-slate-900">
            {maleCount} Masc. / {femaleCount} Fem.
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {total > 0 ? Math.round((maleCount / total) * 100) : 0}% Masc. &bull;{' '}
            {total > 0 ? Math.round((femaleCount / total) * 100) : 0}% Fem.
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-medium block mb-1">Membros Batizados</span>
          <span className="text-2xl font-black text-indigo-600">{baptizedCount}</span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {total > 0 ? Math.round((baptizedCount / total) * 100) : 0}% batizados na IASD
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-medium block mb-1">Total de Unidades</span>
          <span className="text-2xl font-black text-amber-600">
            {Object.keys(unitStats).length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Estruturadas no clube
          </span>
        </div>
      </div>

      {/* Birthdays Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cake className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Aniversariantes do Mês</h3>
              <p className="text-xs text-slate-500">Acompanhe as datas para homenagens na programação do clube</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-slate-600">Mês:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white font-semibold"
            >
              {months.map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {birthdayMembers.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-3 text-center">
            Nenhum aniversariante cadastrado para o mês de {months[selectedMonth - 1]}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {birthdayMembers.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{m.nomeCompleto}</span>
                  <span className="text-[11px] text-slate-500">{m.unidade} &bull; {m.classeAtual || m.classe}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-800 font-mono block">
                    {m.dataNascimento.split('-').reverse().slice(0, 2).join('/')}
                  </span>
                  <span className="text-[10px] text-amber-700">Aniversário</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Breakdowns Row: Classes & Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classes Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#1B3A6B]" />
            Quadro por Classes Progressivas
          </h3>

          <table className="min-w-full text-xs divide-y divide-slate-100">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-2 font-semibold">Classe</th>
                <th className="py-2 text-center font-semibold">Ativos</th>
                <th className="py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classBreakdown.map((item) => (
                <tr key={item.name}>
                  <td className="py-2 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-2 text-center text-emerald-700 font-bold">{item.active}</td>
                  <td className="py-2 text-right font-bold text-slate-900">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Units Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            Quadro por Unidade
          </h3>

          <table className="min-w-full text-xs divide-y divide-slate-100">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-2 font-semibold">Unidade</th>
                <th className="py-2 text-center font-semibold">Ativos</th>
                <th className="py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(unitStats).map(([unitName, counts]) => (
                <tr key={unitName}>
                  <td className="py-2 font-semibold text-slate-800">{unitName}</td>
                  <td className="py-2 text-center text-emerald-700 font-bold">{counts.active}</td>
                  <td className="py-2 text-right font-bold text-slate-900">{counts.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
