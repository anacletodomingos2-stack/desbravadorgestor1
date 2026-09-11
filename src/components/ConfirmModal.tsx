import React, { useState } from 'react';
import type { Member } from '../types';
import { AlertTriangle, PowerOff, Power, Trash2, X } from 'lucide-react';

export type ConfirmActionType = 'inactivate' | 'reactivate' | 'delete';

interface ConfirmModalProps {
  isOpen: boolean;
  type: ConfirmActionType;
  member: Member;
  onClose: () => void;
  onConfirm: (payload?: { reason?: string }) => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  type,
  member,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(type === 'inactivate' && reason ? { reason } : undefined);
  };

  const getDetails = () => {
    switch (type) {
      case 'inactivate':
        return {
          title: 'Inativar Desbravador',
          icon: <PowerOff className="w-5 h-5 text-amber-600" />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          buttonColor: 'bg-amber-600 hover:bg-amber-700',
          buttonText: 'Confirmar Inativação',
          description: `Deseja inativar o membro "${member.nomeCompleto}"? O histórico cadastral e de classes permanecerá preservado.`,
          showReasonInput: true,
        };
      case 'reactivate':
        return {
          title: 'Reativar Desbravador',
          icon: <Power className="w-5 h-5 text-emerald-600" />,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
          buttonText: 'Confirmar Reativação',
          description: `Deseja reativar o membro "${member.nomeCompleto}" no clube? Ele voltará a constar como membro ativo nas listagens e chamadas.`,
          showReasonInput: false,
        };
      case 'delete':
        return {
          title: 'Eliminar Membro Definitivamente',
          icon: <Trash2 className="w-5 h-5 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          buttonColor: 'bg-rose-600 hover:bg-rose-700',
          buttonText: 'Eliminar Definitivo',
          description: `ATENÇÃO: Deseja eliminar definitivamente o membro "${member.nomeCompleto}"? Esta ação é irreversível e removerá todos os registos associados.`,
          showReasonInput: false,
        };
    }
  };

  const config = getDetails();

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor}`}
              >
                {config.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{config.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: {member.numeroIdentificacao || member.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">{config.description}</p>

          {config.showReasonInput && (
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Motivo da Inativação (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Mudança de cidade, estudo, afastamento temporário..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          )}

          {type === 'delete' && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>Esta operação removerá os dados permanentemente da base de dados.</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-xl font-bold text-white transition-opacity hover:opacity-95 shadow-xs cursor-pointer ${config.buttonColor}`}
          >
            {config.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
