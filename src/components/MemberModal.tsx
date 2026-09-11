import React, { useState, useEffect } from 'react';
import { Member, PathfinderClass, RoleType } from '../types';
import { useClub } from '../context/ClubContext';
import { X, Save, User, Shield, HeartPulse, Phone, Calendar } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

const CLASS_OPTIONS: PathfinderClass[] = [
  'Amigo',
  'Companheiro',
  'Pesquisador',
  'Pioneiro',
  'Excursionista',
  'Guia',
  'Líder',
  'Líder Master',
];

const ROLE_OPTIONS: RoleType[] = [
  'Desbravador',
  'Capitão',
  'Secretário de Unidade',
  'Conselheiro',
  'Conselheiro Associado',
  'Instrutor',
  'Secretário do Clube',
  'Tesoureiro',
  'Diretor Associado',
  'Diretor',
];

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, memberToEdit }) => {
  const { units, addMember, updateMember } = useClub();

  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    fullName: '',
    birthDate: '',
    gender: 'M',
    bloodType: 'O+',
    allergies: 'Nenhuma',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    unitId: units[0]?.id || '',
    currentClass: 'Amigo',
    role: 'Desbravador',
    admissionDate: new Date().toISOString().slice(0, 10),
    isActive: true,
    notes: '',
  });

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        fullName: memberToEdit.fullName,
        birthDate: memberToEdit.birthDate,
        gender: memberToEdit.gender,
        bloodType: memberToEdit.bloodType,
        allergies: memberToEdit.allergies,
        phone: memberToEdit.phone,
        guardianName: memberToEdit.guardianName,
        guardianPhone: memberToEdit.guardianPhone,
        unitId: memberToEdit.unitId,
        currentClass: memberToEdit.currentClass,
        role: memberToEdit.role,
        admissionDate: memberToEdit.admissionDate,
        isActive: memberToEdit.isActive,
        notes: memberToEdit.notes || '',
      });
    } else {
      setFormData({
        fullName: '',
        birthDate: '',
        gender: 'M',
        bloodType: 'O+',
        allergies: 'Nenhuma',
        phone: '',
        guardianName: '',
        guardianPhone: '',
        unitId: units[0]?.id || '',
        currentClass: 'Amigo',
        role: 'Desbravador',
        admissionDate: new Date().toISOString().slice(0, 10),
        isActive: true,
        notes: '',
      });
    }
  }, [memberToEdit, units, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (memberToEdit) {
      updateMember(memberToEdit.id, formData);
    } else {
      addMember(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {memberToEdit ? 'Editar Dados do Membro' : 'Ficha de Cadastro de Novo Membro'}
              </h3>
              <p className="text-xs text-slate-500">
                Registo oficial no Portal de Controlo de Membros
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          {/* Section 1: Personal Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              1. Identificação Pessoal
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ex: João Miguel Francisco"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Género
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Club Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              2. Dados do Clube & Classe
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unidade
                </label>
                <select
                  value={formData.unitId}
                  onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Classe Atual
                </label>
                <select
                  value={formData.currentClass}
                  onChange={(e) => setFormData({ ...formData, currentClass: e.target.value as PathfinderClass })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                >
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cargo / Função
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2 flex items-center pt-5">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-400"
                  />
                  <span className="font-semibold text-slate-800">
                    Membro Ativo no Clube
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Health & Blood Type */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              3. Saúde & Emergência
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Grupo Sanguíneo
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="Desconhecido">Não sabe / Desconhecido</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alergias / Cuidados Médicos
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="Ex: Nenhuma ou Rinite, Penicilina, etc."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Guardians */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              4. Contactos & Encarregados
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Telefone do Membro
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+244 9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Encarregado / Pai / Mãe
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="Nome do responsável"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Telefone do Encarregado
                </label>
                <input
                  type="text"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="+244 9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observações / Notas
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {memberToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
