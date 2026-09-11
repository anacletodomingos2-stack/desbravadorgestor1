import React, { useState, useEffect } from 'react';
import { NavPage, AuditRecord } from '../types';
import { loadAuditLogs } from '../services/portalService';
import { useAuth } from '../context/AuthContext';
import {
  History,
  Search,
  Filter,
  ShieldAlert,
  ArrowLeft,
  CheckCircle,
  FileCode,
  Calendar,
  User,
  Trash2,
} from 'lucide-react';

interface AuditHistoryProps {
  onNav: (p: NavPage, id?: string) => void;
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({ onNav }) => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperation, setSelectedOperation] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadAuditLogs(token).then((data) => {
      setLogs(data);
    });
  }, [token]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.newValueJson && log.newValueJson.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.previousValueJson && log.previousValueJson.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesOp =
      selectedOperation === 'all' || log.operation.toUpperCase() === selectedOperation.toUpperCase();

    return matchesSearch && matchesOp;
  });

  const getOperationBadge = (op: string) => {
    switch (op.toUpperCase()) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'STATUS':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-[#1B3A6B]" />
            Trilha de Auditoria & Segurança
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registo rastreável de todas as criações, atualizações, alterações de estado e exclusões
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNav('membros')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Membros
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por ID do membro, usuário ou detalhe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20"
          />
        </div>

        <div>
          <select
            value={selectedOperation}
            onChange={(e) => setSelectedOperation(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20"
          >
            <option value="all">Todas as Operações ({logs.length})</option>
            <option value="CREATE">Apenas Criação (CREATE)</option>
            <option value="UPDATE">Apenas Edição (UPDATE)</option>
            <option value="STATUS">Alteração de Estado (STATUS)</option>
            <option value="DELETE">Exclusão Permanente (DELETE)</option>
          </select>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            Nenhum registo de auditoria encontrado para o filtro atual.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const isExpanded = expandedId === log.id;
              return (
                <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getOperationBadge(
                          log.operation
                        )}`}
                      >
                        {log.operation}
                      </span>

                      <div>
                        <span className="font-bold text-slate-900">
                          {log.entity} ID: <span className="font-mono text-[#1B3A6B]">{log.entityId}</span>
                        </span>
                        <span className="text-slate-400 ml-2 text-[11px]">
                          por <strong>{log.user}</strong> &bull; {log.origin}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="font-mono">{log.date}</span>
                      {(log.previousValueJson || log.newValueJson) && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                          className="text-[#1B3A6B] hover:underline font-bold cursor-pointer"
                        >
                          {isExpanded ? 'Ocultar JSON' : 'Ver Detalhes'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded JSON payload */}
                  {isExpanded && (
                    <div className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto space-y-2">
                      {log.previousValueJson && (
                        <div>
                          <span className="text-rose-400 font-bold block mb-1">
                            &minus; Valor Anterior:
                          </span>
                          <pre className="text-rose-200/90 whitespace-pre-wrap">
                            {JSON.stringify(JSON.parse(log.previousValueJson), null, 2)}
                          </pre>
                        </div>
                      )}

                      {log.newValueJson && (
                        <div>
                          <span className="text-emerald-400 font-bold block mb-1">
                            &#43; Novo Valor Gravado:
                          </span>
                          <pre className="text-emerald-200/90 whitespace-pre-wrap">
                            {JSON.stringify(JSON.parse(log.newValueJson), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditHistory;
