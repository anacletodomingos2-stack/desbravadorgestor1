import React, { useState, useMemo } from 'react';
import { Member, PathfinderClass } from '../types';
import { useClub } from '../context/ClubContext';
import { 
  Search, 
  Filter, 
  UserPlus, 
  LayoutGrid, 
  List, 
  FileText, 
  Edit, 
  Trash2, 
  Phone, 
  Shield, 
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface MembersListProps {
  onOpenAddMember: () => void;
  onEditMember: (member: Member) => void;
  onViewProfile: (member: Member) => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  onOpenAddMember,
  onEditMember,
  onViewProfile,
}) => {
  const { members, units, deleteMember } = useClub();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.guardianName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUnit = selectedUnit === 'all' || m.unitId === selectedUnit;
      const matchesClass = selectedClass === 'all' || m.currentClass === selectedClass;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && m.isActive) ||
        (selectedStatus === 'inactive' && !m.isActive);

      return matchesSearch && matchesUnit && matchesClass && matchesStatus;
    });
  }, [members, searchTerm, selectedUnit, selectedClass, selectedStatus]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nome Completo', 'Classe', 'Cargo', 'Unidade', 'Nascimento', 'Telefone', 'Encarregado', 'Estado'];
    const rows = filteredMembers.map((m) => {
      const u = units.find((unit) => unit.id === m.unitId);
      return [
        m.id,
        `"${m.fullName}"`,
        m.currentClass,
        `"${m.role}"`,
        `"${u?.name || ''}"`,
        m.birthDate,
        m.phone,
        `"${m.guardianName}"`,
        m.isActive ? 'Ativo' : 'Inativo',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `desbravadores_membros_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (member: Member) => {
    if (window.confirm(`Tem a certeza que deseja remover o membro "${member.fullName}"?`)) {
      deleteMember(member.id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Action & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Controlo de Membros
            </h2>
            <p className="text-xs text-slate-500">
              {filteredMembers.length} membro(s) encontrado(s) de {members.length} no clube
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Exportar para Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Visualização em Cartões"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Visualização em Tabela"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onOpenAddMember}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Novo Membro
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Unit Filter */}
          <div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            >
              <option value="all">Todas as Unidades</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            >
              <option value="all">Todas as Classes</option>
              <option value="Amigo">Amigo</option>
              <option value="Companheiro">Companheiro</option>
              <option value="Pesquisador">Pesquisador</option>
              <option value="Pioneiro">Pioneiro</option>
              <option value="Excursionista">Excursionista</option>
              <option value="Guia">Guia</option>
              <option value="Líder">Líder</option>
              <option value="Líder Master">Líder Master</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            >
              <option value="all">Todos os Estados</option>
              <option value="active">Apenas Ativos</option>
              <option value="inactive">Apenas Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results View */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <p className="text-slate-500 text-sm font-medium mb-2">
            Nenhum desbravador encontrado com os filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedUnit('all');
              setSelectedClass('all');
              setSelectedStatus('all');
            }}
            className="text-xs text-amber-600 font-semibold hover:underline cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const unit = units.find((u) => u.id === member.unitId);
            return (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-4">
                  {/* Top card bar */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-900 flex items-center justify-center font-bold text-base border border-amber-500/25">
                        {member.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-amber-600 transition-colors">
                          {member.fullName}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {member.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
                      {member.currentClass}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {unit?.name || 'Geral'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 font-semibold border border-rose-200 text-[10px]">
                      {member.bloodType}
                    </span>
                  </div>

                  {/* Contact Preview */}
                  <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                    <p className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {member.phone || member.guardianPhone || 'Sem telefone'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Resp: {member.guardianName || 'Não informado'}
                    </p>
                  </div>
                </div>

                {/* Bottom Action bar */}
                <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onViewProfile(member)}
                    className="text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Ver Ficha
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditMember(member)}
                      className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member)}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Membro</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Classe</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Unidade</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Cargo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Telefone</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredMembers.map((member) => {
                  const unit = units.find((u) => u.id === member.unitId);
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-900 font-bold flex items-center justify-center">
                            {member.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{member.fullName}</p>
                            <p className="text-[11px] text-slate-400">Resp: {member.guardianName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-[11px]">
                          {member.currentClass}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {unit?.name || 'Geral'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {member.role}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {member.phone || member.guardianPhone || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            member.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {member.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewProfile(member)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Ver Ficha"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditMember(member)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
