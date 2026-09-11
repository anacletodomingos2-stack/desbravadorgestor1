import React from 'react';
import { Member } from '../types';
import { useClub } from '../context/ClubContext';
import { 
  X, 
  Printer, 
  Shield, 
  Phone, 
  HeartPulse, 
  Calendar, 
  UserCheck, 
  Clock, 
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface MemberProfileModalProps {
  member: Member | null;
  onClose: () => void;
  onEdit: (member: Member) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose, onEdit }) => {
  const { units, clubInfo, attendanceSessions, feePayments } = useClub();

  if (!member) return null;

  const unit = units.find((u) => u.id === member.unitId);

  // Calculate age
  let age = 'N/D';
  if (member.birthDate) {
    const birthYear = new Date(member.birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    age = `${currentYear - birthYear} anos`;
  }

  // Attendance stats for this member
  const memberAttendance = attendanceSessions.flatMap((s) => {
    const rec = s.records.find((r) => r.memberId === member.id);
    return rec ? [{ sessionDate: s.date, activity: s.activityTitle, ...rec }] : [];
  });

  const totalSessions = memberAttendance.length;
  const presentSessions = memberAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
  const memberAttendancePercent = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

  // Fees for this member
  const memberFees = feePayments.filter((f) => f.memberId === member.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ficha Individual do Membro &bull; {clubInfo.name}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Ficha
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(member);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
            >
              Editar
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          {/* Member Badge Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md border-2 border-amber-300">
                  {member.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {member.fullName}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {member.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {member.role} &bull; Classe {member.currentClass}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Unidade: <span className="text-slate-200 font-medium">{unit?.name || 'Geral'}</span> &bull; {age}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-xs p-3 rounded-xl border border-slate-700 text-center sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Frequência</span>
                <span className="text-xl font-black text-amber-400">{memberAttendancePercent}%</span>
                <span className="text-[10px] text-slate-400 block">{presentSessions}/{totalSessions} reuniões</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: Pessoal & Clube */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                Dados do Clube
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Data de Admissão:</span>
                  <span className="font-semibold text-slate-800">{member.admissionDate || 'Não registada'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Unidade:</span>
                  <span className="font-semibold text-slate-800">{unit?.name || 'Não atribuída'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Conselheiro:</span>
                  <span className="font-semibold text-slate-800">{unit?.counselorName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Classe Atual:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {member.currentClass}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Data de Nascimento:</span>
                  <span className="font-semibold text-slate-800">{member.birthDate} ({age})</span>
                </div>
              </div>
            </div>

            {/* Box 2: Saúde & Emergência */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                Saúde & Emergência
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Grupo Sanguíneo:</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {member.bloodType}
                  </span>
                </div>
                <div className="py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 block mb-0.5">Alergias / Restrições:</span>
                  <span className="font-medium text-slate-800 bg-white p-1.5 rounded border border-slate-200 block">
                    {member.allergies || 'Nenhuma informada'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Encarregado / Responsável:</span>
                  <span className="font-semibold text-slate-800">{member.guardianName || 'Não registado'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Contacto de Emergência:</span>
                  <span className="font-bold text-blue-700">{member.guardianPhone || member.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes if any */}
          {member.notes && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-900">
              <strong className="block font-bold mb-0.5">Observações da Liderança:</strong>
              {member.notes}
            </div>
          )}

          {/* Attendance History */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Histórico Recente de Presenças
            </h4>
            {memberAttendance.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">Nenhum registo de presença para este membro.</p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Data</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Atividade</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600">Presença</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600">Uniforme</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {memberAttendance.map((rec, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 font-medium text-slate-800">{rec.sessionDate}</td>
                        <td className="px-3 py-2 text-slate-600">{rec.activity}</td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                              rec.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : rec.status === 'late'
                                ? 'bg-amber-100 text-amber-800'
                                : rec.status === 'excused'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {rec.status === 'present'
                              ? 'Presente'
                              : rec.status === 'late'
                              ? 'Atrasado'
                              : rec.status === 'excused'
                              ? 'Justificado'
                              : 'Falta'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-[10px] font-medium text-slate-700">
                            {rec.uniform === 'full'
                              ? 'Completo'
                              : rec.uniform === 'partial'
                              ? 'Incompleto'
                              : 'Sem Uniforme'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Dues History */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-purple-600" />
              Registo de Mensalidades
            </h4>
            {memberFees.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">Nenhum registo de quota/mensalidade atribuído.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {memberFees.map((fee) => (
                  <div
                    key={fee.id}
                    className={`px-3 py-2 rounded-lg border text-xs flex items-center gap-2 ${
                      fee.status === 'paid'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <span className="font-bold">{fee.month}:</span>
                    <span>{fee.amount} Kz</span>
                    <span className="font-bold uppercase text-[10px]">
                      {fee.status === 'paid' ? '✓ Pago' : '⚠ Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
