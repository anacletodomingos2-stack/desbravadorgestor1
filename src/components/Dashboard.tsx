import React from 'react';
import { useClub } from '../context/ClubContext';
import { PathfinderClass } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Layers, 
  CalendarCheck, 
  DollarSign, 
  Cake, 
  Award, 
  UserPlus, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: 'dashboard' | 'members' | 'attendance' | 'units' | 'fees') => void;
  onOpenAddMember: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenAddMember }) => {
  const { members, units, attendanceSessions, feePayments, clubInfo } = useClub();

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.isActive).length;
  const inactiveMembers = totalMembers - activeMembers;

  // Calculate attendance rate
  let avgAttendanceRate = 0;
  if (attendanceSessions.length > 0) {
    const totalRecords = attendanceSessions.reduce((acc, s) => acc + s.records.length, 0);
    const totalPresents = attendanceSessions.reduce(
      (acc, s) => acc + s.records.filter((r) => r.status === 'present' || r.status === 'late').length,
      0
    );
    avgAttendanceRate = totalRecords > 0 ? Math.round((totalPresents / totalRecords) * 100) : 0;
  }

  // Fees calculation
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const currentMonthFees = feePayments.filter((f) => f.month === currentMonthStr || f.month === '2026-03');
  const paidFeesCount = currentMonthFees.filter((f) => f.status === 'paid').length;
  const totalFeesCount = currentMonthFees.length || activeMembers;
  const feeRate = totalFeesCount > 0 ? Math.round((paidFeesCount / totalFeesCount) * 100) : 0;

  // Birthday members this month
  const currentMonthNum = new Date().getMonth() + 1;
  const birthdayMembers = members.filter((m) => {
    if (!m.birthDate) return false;
    const birthMonth = parseInt(m.birthDate.split('-')[1], 10);
    return birthMonth === currentMonthNum;
  });

  // Classes count
  const classOrder: PathfinderClass[] = [
    'Amigo',
    'Companheiro',
    'Pesquisador',
    'Pioneiro',
    'Excursionista',
    'Guia',
    'Líder',
    'Líder Master',
  ];

  const classCounts = classOrder.map((cls) => ({
    name: cls,
    count: members.filter((m) => m.currentClass === cls).length,
  }));

  const maxClassCount = Math.max(...classCounts.map((c) => c.count), 1);

  // Latest attendance
  const latestSession = attendanceSessions[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
              {clubInfo.year} &bull; Painel de Gestão
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {clubInfo.name}
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Portal oficial de controlo e cadastro de desbravadores, unidades, presenças e classes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            id="btn-dashboard-add-member"
            onClick={onOpenAddMember}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Membro
          </button>
          <button
            id="btn-dashboard-attendance"
            onClick={() => onNavigate('attendance')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-amber-400" />
            Fazer Chamada
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div 
          onClick={() => onNavigate('members')}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total de Membros</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{totalMembers}</span>
            <span className="text-xs text-emerald-600 font-medium">{activeMembers} ativos</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {inactiveMembers > 0 ? `${inactiveMembers} inativo(s)` : 'Todos ativos'}
          </div>
        </div>

        {/* Units */}
        <div 
          onClick={() => onNavigate('units')}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Unidades Ativas</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{units.length}</span>
            <span className="text-xs text-slate-500">estruturadas</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Média de {units.length ? Math.round(activeMembers / units.length) : 0} por unidade
          </div>
        </div>

        {/* Attendance Rate */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Frequência Média</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{avgAttendanceRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">nas reuniões</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {attendanceSessions.length} chamada(s) registada(s)
          </div>
        </div>

        {/* Dues / Fees */}
        <div 
          onClick={() => onNavigate('fees')}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-amber-400/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Quotas do Mês</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{feeRate}%</span>
            <span className="text-xs text-slate-500 font-medium">pagas</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {paidFeesCount} de {totalFeesCount} membros em dia
          </div>
        </div>
      </div>

      {/* 2 Column Layout for Charts and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Distribution by Class & Units */}
        <div className="lg:col-span-2 space-y-6">
          {/* Classes Breakdown */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Membros por Classe de Desbravadores
                </h3>
                <p className="text-xs text-slate-500">Distribuição do clube por classes regulares e liderança</p>
              </div>
              <button 
                onClick={() => onNavigate('units')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
              >
                Ver classes &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {classCounts.map((item) => {
                const percent = Math.round((item.count / maxClassCount) * 100);
                return (
                  <div key={item.name} className="flex items-center text-xs">
                    <span className="w-28 font-medium text-slate-700 truncate">{item.name}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3.5 mx-3 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-bold text-slate-900">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Units Summary */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Unidades do Clube
                </h3>
                <p className="text-xs text-slate-500">Conselheiros e efetivo de cada unidade</p>
              </div>
              <button 
                onClick={() => onNavigate('units')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Gerir unidades &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {units.map((unit) => {
                const unitMemberCount = members.filter((m) => m.unitId === unit.id).length;
                return (
                  <div
                    key={unit.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-900">{unit.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {unit.gender === 'M' ? 'Masculina' : unit.gender === 'F' ? 'Feminina' : 'Mista'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic mb-2">"{unit.motto}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-600">Conselheiro: <strong className="text-slate-800">{unit.counselorName}</strong></span>
                      <span className="font-bold text-slate-900 px-2 py-0.5 bg-white rounded border border-slate-200">
                        {unitMemberCount} membros
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Birthdays & Recent Roll-Call */}
        <div className="space-y-6">
          {/* Birthdays Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Cake className="w-4 h-4 text-rose-500" />
              Aniversariantes do Mês
            </h3>
            <p className="text-xs text-slate-500 mb-3">Parabéns aos desbravadores este mês</p>

            {birthdayMembers.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Nenhum aniversário este mês.</p>
            ) : (
              <div className="space-y-2.5">
                {birthdayMembers.map((m) => {
                  const day = m.birthDate ? m.birthDate.split('-')[2] : '';
                  const unit = units.find((u) => u.id === m.unitId);
                  return (
                    <div key={m.id} className="flex items-center justify-between p-2.5 bg-rose-50/50 rounded-lg border border-rose-100">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{m.fullName}</p>
                        <p className="text-[11px] text-slate-500">{unit?.name || 'Clube'} &bull; {m.currentClass}</p>
                      </div>
                      <span className="px-2 py-1 bg-white text-rose-600 font-bold text-xs rounded-md shadow-2xs border border-rose-200">
                        Dia {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Latest Attendance Roll Call */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              Última Chamada Realizada
            </h3>
            {latestSession ? (
              <div className="mt-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{latestSession.activityTitle}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{latestSession.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="bg-white p-2 rounded border border-slate-100">
                      <span className="block text-emerald-600 font-bold text-sm">
                        {latestSession.records.filter((r) => r.status === 'present').length}
                      </span>
                      <span className="text-[10px] text-slate-500">Presentes</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-100">
                      <span className="block text-amber-600 font-bold text-sm">
                        {latestSession.records.filter((r) => r.status === 'late').length}
                      </span>
                      <span className="text-[10px] text-slate-500">Atrasados</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-100">
                      <span className="block text-rose-600 font-bold text-sm">
                        {latestSession.records.filter((r) => r.status === 'absent').length}
                      </span>
                      <span className="text-[10px] text-slate-500">Faltas</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('attendance')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
                >
                  Ver Histórico de Presenças
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Nenhuma chamada realizada ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
