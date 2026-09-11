import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { AttendanceSession, MemberAttendance } from '../types';
import { 
  CalendarCheck, 
  Calendar, 
  Plus, 
  Check, 
  Clock, 
  X, 
  AlertCircle, 
  Shirt, 
  CheckCheck,
  ChevronRight
} from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const { members, units, attendanceSessions, addAttendanceSession } = useClub();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    attendanceSessions[0]?.id || null
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New session form state
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTitle, setNewTitle] = useState('Reunião Regular de Domingo');
  const [filterUnitId, setFilterUnitId] = useState<string>('all');
  const [recordsDraft, setRecordsDraft] = useState<MemberAttendance[]>(() => {
    return members.map((m) => ({
      memberId: m.id,
      status: 'present',
      uniform: 'full',
    }));
  });

  // Current session being viewed
  const currentSession = attendanceSessions.find((s) => s.id === selectedSessionId);

  // Start new session
  const handleStartNewSession = () => {
    setIsCreatingNew(true);
    setNewDate(new Date().toISOString().slice(0, 10));
    setNewTitle('Reunião Regular');
    setRecordsDraft(
      members.map((m) => ({
        memberId: m.id,
        status: 'present',
        uniform: 'full',
      }))
    );
  };

  // Save new session
  const handleSaveNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAttendanceSession({
      date: newDate,
      activityTitle: newTitle,
      records: recordsDraft,
    });

    setIsCreatingNew(false);
  };

  // Update record in draft
  const updateDraftRecord = (
    memberId: string,
    status: MemberAttendance['status'],
    uniform: MemberAttendance['uniform']
  ) => {
    setRecordsDraft((prev) =>
      prev.map((r) => (r.memberId === memberId ? { ...r, status, uniform } : r))
    );
  };

  // Mark all in draft
  const handleMarkAllDraft = (status: MemberAttendance['status']) => {
    setRecordsDraft((prev) => prev.map((r) => ({ ...r, status })));
  };

  // Filtered members for display
  const activeClubMembers = members.filter((m) => m.isActive);
  const displayMembers =
    filterUnitId === 'all'
      ? activeClubMembers
      : activeClubMembers.filter((m) => m.unitId === filterUnitId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            Controlo de Presenças e Uniforme
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registe a chamada dos desbravadores e a inspeção de uniforme em cada atividade
          </p>
        </div>

        <button
          onClick={handleStartNewSession}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nova Chamada
        </button>
      </div>

      {isCreatingNew ? (
        /* Create New Session Interface */
        <div className="bg-white rounded-2xl p-6 border border-emerald-300 shadow-md space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Registo em Curso
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Lançamento de Frequência & Uniforme
              </h3>
            </div>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data da Atividade
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Título / Descrição da Reunião
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Instrução de Nós, Especialidade de Pioneirismo, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick Filter & Mass action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Filtrar Unidade:</span>
              <select
                value={filterUnitId}
                onChange={(e) => setFilterUnitId(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-none"
              >
                <option value="all">Todas as Unidades</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ações Rápidas:</span>
              <button
                type="button"
                onClick={() => handleMarkAllDraft('present')}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Todos Presentes
              </button>
              <button
                type="button"
                onClick={() => handleMarkAllDraft('absent')}
                className="px-2.5 py-1 bg-rose-50 text-rose-700 font-semibold rounded border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Todos Faltaram
              </button>
            </div>
          </div>

          {/* Members Roll Call List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {displayMembers.map((member) => {
              const rec = recordsDraft.find((r) => r.memberId === member.id) || {
                memberId: member.id,
                status: 'present',
                uniform: 'full',
              };
              const unit = units.find((u) => u.id === member.unitId);

              return (
                <div
                  key={member.id}
                  className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{member.fullName}</p>
                      <p className="text-[11px] text-slate-500">
                        {unit?.name} &bull; {member.currentClass} &bull; {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status selection */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateDraftRecord(member.id, 'present', rec.uniform)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          rec.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Presente
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDraftRecord(member.id, 'late', rec.uniform)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          rec.status === 'late'
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Atraso
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDraftRecord(member.id, 'excused', rec.uniform)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          rec.status === 'excused'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Justificado
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDraftRecord(member.id, 'absent', rec.uniform)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                          rec.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Falta
                      </button>
                    </div>

                    {/* Uniform */}
                    <div className="flex items-center gap-1">
                      <Shirt className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={rec.uniform}
                        onChange={(e) =>
                          updateDraftRecord(
                            member.id,
                            rec.status,
                            e.target.value as MemberAttendance['uniform']
                          )
                        }
                        className="px-2 py-1 border border-slate-200 rounded-md bg-white text-slate-700 text-[11px]"
                      >
                        <option value="full">Uniforme Completo</option>
                        <option value="partial">Incompleto</option>
                        <option value="none">Sem Uniforme</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveNewSession}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Finalizar e Salvar Chamada
            </button>
          </div>
        </div>
      ) : (
        /* Sessions History & Details */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 1 Col: List of Past Sessions */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Histórico de Chamadas ({attendanceSessions.length})
            </h3>

            {attendanceSessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhuma chamada registada até o momento.
              </p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {attendanceSessions.map((sess) => {
                  const isSelected = sess.id === selectedSessionId;
                  const total = sess.records.length;
                  const present = sess.records.filter((r) => r.status === 'present' || r.status === 'late').length;
                  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => setSelectedSessionId(sess.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {sess.activityTitle}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                        <span>{sess.date}</span>
                        <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                          {pct}% ({present}/{total})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right 2 Cols: Selected Session Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            {currentSession ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">
                      Data: {currentSession.date}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {currentSession.activityTitle}
                    </h3>
                  </div>

                  {/* Summary Pills */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold">
                      {currentSession.records.filter((r) => r.status === 'present').length} Presentes
                    </span>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold">
                      {currentSession.records.filter((r) => r.status === 'late').length} Atrasos
                    </span>
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg font-bold">
                      {currentSession.records.filter((r) => r.status === 'absent').length} Faltas
                    </span>
                  </div>
                </div>

                {/* Table of records */}
                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Desbravador</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Unidade</th>
                        <th className="px-4 py-2.5 text-center font-semibold text-slate-600">Presença</th>
                        <th className="px-4 py-2.5 text-center font-semibold text-slate-600">Uniforme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {currentSession.records.map((rec) => {
                        const m = members.find((mem) => mem.id === rec.memberId);
                        const u = m ? units.find((unit) => unit.id === m.unitId) : null;

                        return (
                          <tr key={rec.memberId} className="hover:bg-slate-50/80">
                            <td className="px-4 py-2.5">
                              <span className="font-bold text-slate-900">{m?.fullName || 'Desbravador'}</span>
                              <span className="block text-[11px] text-slate-400">{m?.currentClass}</span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">{u?.name || 'Geral'}</td>
                            <td className="px-4 py-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
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
                            <td className="px-4 py-2.5 text-center font-medium text-slate-700">
                              {rec.uniform === 'full'
                                ? 'Completo'
                                : rec.uniform === 'partial'
                                ? 'Incompleto'
                                : 'Sem Uniforme'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 text-xs">
                Selecione uma chamada à esquerda para ver a lista de presenças.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
