import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { Unit, PathfinderClass } from '../types';
import { 
  Layers, 
  Award, 
  ShieldCheck, 
  Plus, 
  Users, 
  Phone, 
  CheckCircle2, 
  BookOpen,
  Sparkles,
  X
} from 'lucide-react';

interface ClassMeta {
  name: PathfinderClass;
  age: string;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  description: string;
}

const CLASSES_METADATA: ClassMeta[] = [
  {
    name: 'Amigo',
    age: '10 anos',
    color: '#2563eb',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    textColor: 'text-blue-800',
    description: 'Descoberta da Bíblia, nós básicos, história dos pioneiros e saúde física.',
  },
  {
    name: 'Companheiro',
    age: '11 anos',
    color: '#dc2626',
    bgLight: 'bg-red-50',
    border: 'border-red-200',
    textColor: 'text-red-800',
    description: 'Amizade e companheirismo, caminhadas, primeiros socorros e orientação básica.',
  },
  {
    name: 'Pesquisador',
    age: '12 anos',
    color: '#16a34a',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    textColor: 'text-emerald-800',
    description: 'Pesquisa da natureza, astronomia, acampamento e estudo sistemático da fé.',
  },
  {
    name: 'Pioneiro',
    age: '13 anos',
    color: '#0284c7',
    bgLight: 'bg-sky-50',
    border: 'border-sky-200',
    textColor: 'text-sky-800',
    description: 'Pioneirismo avançado, pioneiros adventistas, nós complexos e liderança inicial.',
  },
  {
    name: 'Excursionista',
    age: '14 anos',
    color: '#7c3aed',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
    textColor: 'text-purple-800',
    description: 'Excursões na selva, sobrevivência ao ar livre e cidadania cristã.',
  },
  {
    name: 'Guia',
    age: '15 anos',
    color: '#ca8a04',
    bgLight: 'bg-yellow-50',
    border: 'border-yellow-200',
    textColor: 'text-yellow-900',
    description: 'Preparação para liderança ativa, guia espiritual e serviço comunitário.',
  },
  {
    name: 'Líder',
    age: '16+ anos',
    color: '#4f46e5',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200',
    textColor: 'text-indigo-900',
    description: 'Investidura oficial de Liderança de Desbravadores.',
  },
  {
    name: 'Líder Master',
    age: '18+ anos',
    color: '#b45309',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    textColor: 'text-amber-900',
    description: 'Grau avançado com mestrados e especializações na liderança distrital e regional.',
  },
];

export const UnitsClassesView: React.FC = () => {
  const { units, members, addUnit } = useClub();

  const [activeSubTab, setActiveSubTab] = useState<'units' | 'classes'>('units');
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);

  // New Unit Form
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitGender, setNewUnitGender] = useState<'M' | 'F' | 'Misto'>('M');
  const [newUnitCounselor, setNewUnitCounselor] = useState('');
  const [newUnitCounselorPhone, setNewUnitCounselorPhone] = useState('');
  const [newUnitMotto, setNewUnitMotto] = useState('');

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim() || !newUnitCounselor.trim()) return;

    addUnit({
      name: newUnitName,
      gender: newUnitGender,
      counselorName: newUnitCounselor,
      counselorPhone: newUnitCounselorPhone,
      color: '#3b82f6',
      motto: newUnitMotto || 'Sempre avante com Cristo!',
    });

    setNewUnitName('');
    setNewUnitCounselor('');
    setNewUnitCounselorPhone('');
    setNewUnitMotto('');
    setIsAddUnitOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            Unidades do Clube & Classes Progressivas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organização das unidades e acompanhamento das classes regulares e avançadas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('units')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'units'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unidades ({units.length})
            </button>
            <button
              onClick={() => setActiveSubTab('classes')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'classes'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classes de Desbravadores
            </button>
          </div>

          {activeSubTab === 'units' && (
            <button
              onClick={() => setIsAddUnitOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nova Unidade
            </button>
          )}
        </div>
      </div>

      {/* Units View */}
      {activeSubTab === 'units' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {units.map((unit) => {
            const unitMembers = members.filter((m) => m.unitId === unit.id);
            const activeUnitMembers = unitMembers.filter((m) => m.isActive);

            return (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                        <h3 className="font-bold text-slate-900 text-base">{unit.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-0.5">"{unit.motto}"</p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        unit.gender === 'M'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : unit.gender === 'F'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {unit.gender === 'M' ? 'Masculina' : unit.gender === 'F' ? 'Feminina' : 'Mista'}
                    </span>
                  </div>

                  {/* Counselor Info */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 my-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Conselheiro(a)</span>
                      <strong className="text-slate-800">{unit.counselorName}</strong>
                    </div>
                    {unit.counselorPhone && (
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {unit.counselorPhone}
                      </span>
                    )}
                  </div>

                  {/* Members inside Unit */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Membros na Unidade</span>
                      <span className="text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                        {activeUnitMembers.length} ativo(s)
                      </span>
                    </h4>

                    {unitMembers.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">Nenhum membro atribuído a esta unidade.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {unitMembers.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                          >
                            <span className="font-semibold text-slate-800">{m.fullName}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white text-slate-700 border border-slate-200 rounded">
                                {m.currentClass}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {m.role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Classes Progression View */}
      {activeSubTab === 'classes' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Guia das Classes Regulares dos Desbravadores</p>
              <p className="text-amber-800 mt-0.5">
                Cada classe tem requisitos específicos de desenvolvimento físico, mental e espiritual. Abaixo vê os membros atualmente inscritos em cada classe.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLASSES_METADATA.map((cls) => {
              const classMembers = members.filter((m) => m.currentClass === cls.name && m.isActive);

              return (
                <div
                  key={cls.name}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${cls.bgLight} ${cls.textColor} border ${cls.border}`}>
                        {cls.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {cls.age}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 min-h-[40px]">
                      {cls.description}
                    </p>

                    <div className="border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-700">Desbravadores</span>
                        <span className="font-extrabold text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">
                          {classMembers.length}
                        </span>
                      </div>

                      {classMembers.length === 0 ? (
                        <p className="text-[11px] text-slate-400 py-2 italic">Nenhum membro nesta classe.</p>
                      ) : (
                        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                          {classMembers.map((m) => (
                            <div key={m.id} className="text-[11px] font-medium text-slate-800 py-1 border-b border-slate-50 truncate">
                              &bull; {m.fullName}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {isAddUnitOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Adicionar Nova Unidade</h3>
              <button
                onClick={() => setIsAddUnitOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome da Unidade *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sentinelas, Falcões, etc."
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Categoria da Unidade</label>
                <select
                  value={newUnitGender}
                  onChange={(e) => setNewUnitGender(e.target.value as 'M' | 'F' | 'Misto')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
                >
                  <option value="M">Masculina</option>
                  <option value="F">Feminina</option>
                  <option value="Misto">Mista / Liderança</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Conselheiro *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do líder responsável"
                  value={newUnitCounselor}
                  onChange={(e) => setNewUnitCounselor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefone do Conselheiro</label>
                <input
                  type="text"
                  placeholder="+244 9..."
                  value={newUnitCounselorPhone}
                  onChange={(e) => setNewUnitCounselorPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lema / Grito de Guerra</label>
                <input
                  type="text"
                  placeholder="Lema inspirador da unidade"
                  value={newUnitMotto}
                  onChange={(e) => setNewUnitMotto(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUnitOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Criar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
