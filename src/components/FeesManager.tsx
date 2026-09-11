import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Plus, 
  Search,
  Filter
} from 'lucide-react';

export const FeesManager: React.FC = () => {
  const { members, units, feePayments, toggleFeeStatus, addFeePayment } = useClub();

  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchMember, setSearchMember] = useState('');

  const activeMembers = members.filter((m) => m.isActive);

  // Payments for selected month
  const monthPayments = feePayments.filter((p) => p.month === selectedMonth);

  // Quick helper to ensure all active members have a payment entry for this month
  const membersWithPayments = activeMembers.map((member) => {
    const payment = monthPayments.find((p) => p.memberId === member.id);
    return {
      member,
      payment,
      status: payment ? payment.status : 'pending',
      amount: payment ? payment.amount : 2000,
      paidDate: payment ? payment.paidDate : undefined,
      paymentId: payment ? payment.id : null,
    };
  });

  // Filtered
  const filteredList = membersWithPayments.filter((item) => {
    const matchesSearch = item.member.fullName.toLowerCase().includes(searchMember.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'paid' && item.status === 'paid') ||
      (filterStatus === 'pending' && item.status === 'pending');
    return matchesSearch && matchesStatus;
  });

  const totalExpected = activeMembers.length * 2000;
  const totalCollected = filteredList
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);
  const totalPending = totalExpected - totalCollected;

  const handleToggleStatus = (memberId: string, paymentId: string | null) => {
    if (paymentId) {
      toggleFeeStatus(paymentId);
    } else {
      // Create new payment as paid
      addFeePayment({
        memberId,
        month: selectedMonth,
        amount: 2000,
        paidDate: new Date().toISOString().slice(0, 10),
        status: 'paid',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Controlo de Quotas & Mensalidades
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe o pagamento de mensalidades e contribuições dos membros do clube
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="font-semibold text-slate-600 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Mês de Referência:
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 font-medium block mb-1">Total Esperado ({selectedMonth})</span>
          <span className="text-2xl font-black text-slate-900">{totalExpected.toLocaleString()} Kz</span>
          <span className="text-[11px] text-slate-400 block mt-1">{activeMembers.length} membros ativos (2.000 Kz/mês)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-emerald-700 font-medium block mb-1">Total Arrecadado</span>
          <span className="text-2xl font-black text-emerald-600">{totalCollected.toLocaleString()} Kz</span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            {totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}% arrecadado
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/20">
          <span className="text-amber-700 font-medium block mb-1">Total Pendente</span>
          <span className="text-2xl font-black text-amber-600">{totalPending.toLocaleString()} Kz</span>
          <span className="text-[11px] text-amber-600 font-semibold block mt-1">
            {totalExpected > 0 ? Math.round((totalPending / totalExpected) * 100) : 0}% a regularizar
          </span>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar desbravador..."
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Filtrar Estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'paid' | 'pending')}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 bg-white"
            >
              <option value="all">Todos ({filteredList.length})</option>
              <option value="paid">Apenas Pagos</option>
              <option value="pending">Apenas Pendentes</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Desbravador</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Unidade</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Valor da Quota</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-600">Data de Pagamento</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredList.map(({ member, payment, status, amount, paidDate, paymentId }) => {
                const unit = units.find((u) => u.id === member.unitId);
                const isPaid = status === 'paid';

                return (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{member.fullName}</span>
                      <span className="text-[11px] text-slate-400">{member.currentClass} &bull; {member.role}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {unit?.name || 'Geral'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {amount.toLocaleString()} Kz
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Pago
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Pendente
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      {paidDate || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggleStatus(member.id, paymentId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isPaid
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs'
                        }`}
                      >
                        {isPaid ? 'Marcar Pendente' : 'Confirmar Pagamento'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
