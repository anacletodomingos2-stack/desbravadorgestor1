import React from 'react';
import { Member, NavPage } from '../types';
import {
  Users,
  UserCheck,
  UserX,
  Droplets,
  UserPlus,
  ArrowRight,
  Shield,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';

interface DashboardProps {
  members: Member[];
  onNav: (p: NavPage, id?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ members, onNav }) => {
  const total = members.length;
  const activeCount = members.filter((m) => m.ativo).length;
  const inactiveCount = total - activeCount;
  const baptizedCount = members.filter((m) => m.membroBaptizado).length;

  const maleCount = members.filter((m) => m.sexo === 'M').length;
  const femaleCount = members.filter((m) => m.sexo === 'F').length;

  // Group by progressive class
  const classOrder = ['Amigo', 'Companheiro', 'Pesquisador', 'Pioneiro', 'Excursionista', 'Guia', 'Líder', 'Líder Master'];
  const classStats = classOrder.map((cls) => ({
    name: cls,
    count: members.filter((m) => (m.classeAtual || m.classe) === cls).length,
  }));

  // Group by Unit
  const unitsMap: Record<string, number> = {};
  members.forEach((m) => {
    const unit = m.unidade || 'Sem Unidade';
    unitsMap[unit] = (unitsMap[unit] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: '#1B3A6B' }}>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 inline-block mb-2">
            Painel Geral do Clube
          </span>
          <h2 className="text-xl font-bold tracking-tight">Portal de Controlo de Membros</h2>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            Gestão oficial de cadastro de desbravadores, histórico de classes, batismo e auditoria em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNav('cadastrar')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Membro
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total de Membros</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-xs text-slate-400 font-medium">cadastrados</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <span>{maleCount} Masculinos</span>
            <span>&bull;</span>
            <span>{femaleCount} Femininos</span>
          </div>
        </div>

        {/* Active Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Membros Ativos</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{activeCount}</span>
            <span className="text-xs text-slate-400 font-medium">
              {total > 0 ? Math.round((activeCount / total) * 100) : 0}% do clube
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            Em plena atividade regular
          </div>
        </div>

        {/* Inactive Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Inativos / Afastados</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{inactiveCount}</span>
            <span className="text-xs text-slate-400 font-medium">preservados</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Histórico e fichas mantidos
          </div>
        </div>

        {/* Baptized */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Membros Batizados</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{baptizedCount}</span>
            <span className="text-xs text-slate-400 font-medium">
              {total > 0 ? Math.round((baptizedCount / total) * 100) : 0}% batizados
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {total - baptizedCount} em preparação espiritual
          </div>
        </div>
      </div>

      {/* Classes & Units Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Progression */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1B3A6B]" />
              <h3 className="text-sm font-bold text-slate-900">Membros por Classe Progressiva</h3>
            </div>
            <button
              onClick={() => onNav('membros')}
              className="text-xs font-semibold text-[#1B3A6B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {classStats.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center gap-3 text-xs">
                  <span className="w-28 font-medium text-slate-700 truncate">{item.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: '#1B3A6B',
                      }}
                    />
                  </div>
                  <span className="w-12 text-right font-bold text-slate-800">
                    {item.count} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Units Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Distribuição por Unidade</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {Object.keys(unitsMap).length} Unidades
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(unitsMap).map(([unitName, count]) => (
              <div
                key={unitName}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-slate-800 block truncate">{unitName}</span>
                  <span className="text-[11px] text-slate-400">Unidade Oficial</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-black text-xs text-[#1B3A6B]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Desbravadores Cadastrados Recentemente</h3>
            <p className="text-xs text-slate-500">Últimos registros da base de dados do clube</p>
          </div>
          <button
            onClick={() => onNav('membros')}
            className="text-xs font-bold text-[#1B3A6B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Abrir Lista Completa <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead>
              <tr className="text-left text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Desbravador</th>
                <th className="py-2.5 px-3">Nº Identificação</th>
                <th className="py-2.5 px-3">Classe</th>
                <th className="py-2.5 px-3">Unidade</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.slice(0, 5).map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center font-bold text-[10px]">
                        {m.nomeCompleto.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{m.nomeCompleto}</span>
                        <span className="text-[10px] text-slate-400">{m.telefone || 'Sem contato'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 font-medium">
                    {m.numeroIdentificacao || m.id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-semibold">
                    {m.classeAtual || m.classe}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {m.unidade}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.ativo
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {m.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onNav('detalhe', m.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#1B3A6B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
