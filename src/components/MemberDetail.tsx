import React, { useState } from 'react';
import { Member, NavPage } from '../types';
import {
  Printer,
  Edit2,
  Power,
  PowerOff,
  Trash2,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  Droplets,
  Calendar,
  Shield,
  FileText,
  AlertTriangle,
  HeartPulse,
} from 'lucide-react';

interface MemberDetailProps {
  member: Member;
  onNav: (p: NavPage, id?: string) => void;
  onPrintFicha: () => void;
  onPrintInscricao?: () => void;
  onInactivate: (id: string, reason?: string) => Promise<void>;
  onReactivate: (id: string) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
  onDeletePermanent: (id: string) => Promise<void>;
}

export const MemberDetail: React.FC<MemberDetailProps> = ({
  member,
  onNav,
  onPrintFicha,
  onPrintInscricao,
  onToggleStatus,
  onDeletePermanent,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate age if birthdate available
  const calculateAge = (birthdate: string) => {
    if (!birthdate) return null;
    const diff = Date.now() - new Date(birthdate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(member.dataNascimento);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeletePermanent(member.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNav('membros')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B3A6B] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista de Membros
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Print Ficha de Desbravador */}
          <button
            onClick={onPrintFicha}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            title="Imprimir Ficha Oficial do Desbravador (A4)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Ficha de Desbravador
          </button>

          {/* Print Ficha de Inscrição */}
          {onPrintInscricao && (
            <button
              onClick={onPrintInscricao}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              title="Imprimir Ficha de Inscrição com Termo de Compromisso (A4)"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Ficha de Inscrição
            </button>
          )}

          {/* Edit */}
          <button
            onClick={() => onNav('editar', member.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-95 shadow-xs cursor-pointer"
            style={{ background: '#1B3A6B' }}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Editar Dados
          </button>

          {/* Status Toggle */}
          <button
            onClick={() => onToggleStatus(member.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              member.ativo
                ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {member.ativo ? (
              <>
                <PowerOff className="w-3.5 h-3.5 text-amber-600" />
                Inativar
              </>
            ) : (
              <>
                <Power className="w-3.5 h-3.5 text-emerald-600" />
                Reativar
              </>
            )}
          </button>

          {/* Delete Permanent */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Member Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {member.foto ? (
              <img
                src={member.foto}
                alt={member.nomeCompleto}
                className="w-16 h-20 rounded-2xl object-cover border-2 border-[#1B3A6B]/20 shadow-md shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#1B3A6B] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                {member.nomeCompleto.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900">{member.nomeCompleto}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    member.ativo
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {member.ativo ? 'Membro Ativo' : 'Membro Inativo'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="font-mono font-semibold text-[#1B3A6B]">
                  {member.numeroIdentificacao || member.id}
                </span>
                <span>&bull;</span>
                <span>Unidade: <strong>{member.unidade}</strong></span>
                <span>&bull;</span>
                <span>Classe: <strong>{member.classeAtual || member.classe}</strong></span>
                <span>&bull;</span>
                <span>Cargo: <strong>{member.cargo}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 text-xs text-slate-500">
            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">Data de Ingresso</span>
            <span className="font-bold text-slate-800 text-sm">{member.dataEntrada || 'Não informada'}</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Dados Pessoais & Documentação */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-[#1B3A6B]" />
            Dados Pessoais & Identificação
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Data de Nascimento:</span>
              <span className="font-semibold text-slate-800">
                {member.dataNascimento ? `${member.dataNascimento} (${age} anos)` : 'Não informada'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Sexo:</span>
              <span className="font-semibold text-slate-800">
                {member.sexo === 'M' ? 'Masculino' : member.sexo === 'F' ? 'Feminino' : 'Não especificado'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Cédula / B.I.:</span>
              <span className="font-mono font-semibold text-slate-800">{member.cedula || 'Não informada'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Escola / Grau de Ensino:</span>
              <span className="font-semibold text-slate-800">{member.escola || 'Não informada'}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Telefone Direto:</span>
              <span className="font-semibold text-slate-800">{member.telefone || 'Sem telefone'}</span>
            </div>
          </div>
        </div>

        {/* 2. Encarregados & Contatos de Emergência */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            Encarregados & Contatos
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Encarregado 1 (Pai/Tutor):</span>
              <span className="font-semibold text-slate-800">{member.nomeEncarregado1 || '-'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Contato Pai/Tutor:</span>
              <span className="font-semibold text-slate-800">{member.contatoPai || '-'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Encarregado 2 (Mãe):</span>
              <span className="font-semibold text-slate-800">{member.nomeEncarregado2 || '-'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Contato Mãe:</span>
              <span className="font-semibold text-slate-800">{member.contatoMae || '-'}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Email:</span>
              <span className="font-semibold text-slate-800">{member.email || '-'}</span>
            </div>
          </div>
        </div>

        {/* 3. Residência & Localização */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            Residência & Endereço
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Endereço Completo:</span>
              <span className="font-semibold text-slate-800 text-right">{member.endereco || 'Não informado'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Bairro:</span>
              <span className="font-semibold text-slate-800">{member.bairro || '-'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Município:</span>
              <span className="font-semibold text-slate-800">{member.municipio || '-'}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Província:</span>
              <span className="font-semibold text-slate-800">{member.provincia || 'Luanda'}</span>
            </div>
          </div>
        </div>

        {/* 4. Igreja & Batismo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Droplets className="w-4 h-4 text-indigo-600" />
            Dados Eclesiásticos & Batismo
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Igreja Local:</span>
              <span className="font-semibold text-slate-800">{member.igreja || 'IASD'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Distrito Eclesiástico:</span>
              <span className="font-semibold text-slate-800">{member.distrito || '-'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Região:</span>
              <span className="font-semibold text-slate-800">{member.regiao || '-'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Estado Batismal:</span>
              <span className={`font-bold ${member.membroBaptizado ? 'text-indigo-600' : 'text-slate-500'}`}>
                {member.membroBaptizado ? 'Batizado na IASD' : 'Não batizado'}
              </span>
            </div>

            {member.membroBaptizado && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Nº Registo Batismo:</span>
                  <span className="font-mono font-semibold text-slate-800">{member.numeroBaptismo || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Data do Batismo:</span>
                  <span className="font-semibold text-slate-800">{member.dataBaptismo || '-'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5. Carreira de Classes e Investiduras */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Award className="w-4 h-4 text-[#1B3A6B]" />
            Carreira de Desbravador & Investiduras
          </div>

          <div className="text-xs">
            <span className="text-slate-400">Classe Atual: </span>
            <span className="font-bold text-[#1B3A6B] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
              {member.classeAtual || member.classe}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Data da Investidura Atual</span>
            <span className="font-bold text-slate-800 text-sm">
              {member.dataInvestidura || 'Aguardando Investidura'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Unidade / Patrulha</span>
            <span className="font-bold text-slate-800 text-sm">
              {member.unidade} ({member.cargo})
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Classes Anteriores Concluídas
          </h4>
          {!member.classesAnteriores || member.classesAnteriores.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">
              Nenhuma classe anterior registada no histórico do desbravador.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {member.classesAnteriores.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-bold text-slate-800">Classe {c.classe}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {c.data}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Observações & Ficha Médica */}
      {member.observacoes && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FileText className="w-4 h-4 text-slate-600" />
            Observações Gerais & Histórico Clínico
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {member.observacoes}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Eliminar Membro Definitivamente?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tem a certeza de que deseja eliminar o membro{' '}
                  <strong className="text-slate-900">"{member.nomeCompleto}"</strong>?
                </p>
                <p className="text-[11px] text-rose-700 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  Esta ação é irreversível e o registo será removido de todas as listas e relatórios.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50 border-t border-slate-200 text-xs">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-lg font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'A eliminar...' : 'Confirmar Eliminação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetail;
