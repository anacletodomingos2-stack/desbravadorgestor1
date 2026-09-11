import React, { useState } from 'react';
import { Member, InvestiduraClass } from '../types';
import {
  Save,
  X,
  Plus,
  Trash2,
  User,
  MapPin,
  Users2,
  Award,
  Droplets,
  FileText,
  Shield,
  Calendar,
  Upload,
  Camera,
  CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react';

interface MemberFormProps {
  initial: Omit<Member, 'id'> & { id?: string };
  onSave: (data: Omit<Member, 'id'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const AVAILABLE_CLASSES = [
  'Amigo',
  'Companheiro',
  'Pesquisador',
  'Pioneiro',
  'Excursionista',
  'Guia',
  'Líder',
  'Líder Master',
];

const AVAILABLE_UNITS = [
  'Águias Reais',
  'Estrelas da Manhã',
  'Guerreiros da Fé',
  'Lírios do Vale',
  'Falcões',
  'Sentinelas',
  'Diretoria / Liderança',
];

const AVAILABLE_ROLES = [
  'Desbravador',
  'Capitão de Unidade',
  'Secretário de Unidade',
  'Conselheiro(a)',
  'Conselheiro(a) Associado',
  'Instrutor de Classe',
  'Tesoureiro',
  'Secretário do Clube',
  'Diretor Associado',
  'Diretor do Clube',
  'Capelão',
];

export const MemberForm: React.FC<MemberFormProps> = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'> & { id?: string }>({
    ...initial,
    classesAnteriores: initial.classesAnteriores ? [...initial.classesAnteriores] : [],
  });

  const [activeTab, setActiveTab] = useState<'pessoal' | 'contatos' | 'clube' | 'batismo' | 'observacoes'>('pessoal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Class addition row
  const [newPreviousClass, setNewPreviousClass] = useState('Amigo');
  const [newPreviousDate, setNewPreviousDate] = useState('');

  // Image Upload state and refs
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const processImageFile = (file: File) => {
    setPhotoUploadError(null);
    if (!file.type.startsWith('image/')) {
      setPhotoUploadError('Por favor selecione um ficheiro de imagem válido (PNG, JPG, JPEG ou WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoUploadError('A imagem deve ter no máximo 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      // Optimize image for 3x4 portrait proportions
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 640;
          const MAX_HEIGHT = 850;
          let w = img.width;
          let h = img.height;

          if (w > MAX_WIDTH || h > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            handleChange('foto', compressed);
          } else {
            handleChange('foto', result);
          }
        } catch {
          handleChange('foto', result);
        }
      };
      img.onerror = () => {
        handleChange('foto', result);
      };
      img.src = result;
    };
    reader.onerror = () => {
      setPhotoUploadError('Erro ao carregar o ficheiro de imagem.');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(true);
  };

  const handlePhotoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(false);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleChange = (field: keyof Member, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPreviousClass = () => {
    if (!newPreviousClass || !newPreviousDate) {
      alert('Por favor selecione a classe e a data da investidura anterior.');
      return;
    }
    const updated = [
      ...(formData.classesAnteriores || []),
      { classe: newPreviousClass, data: newPreviousDate },
    ];
    setFormData((prev) => ({ ...prev, classesAnteriores: updated }));
    setNewPreviousDate('');
  };

  const handleRemovePreviousClass = (index: number) => {
    const updated = [...(formData.classesAnteriores || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, classesAnteriores: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeCompleto.trim()) {
      setErrorMsg('O Nome Completo é obrigatório.');
      setActiveTab('pessoal');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await onSave({
        ...formData,
        classe: formData.classeAtual || formData.classe || 'Amigo',
        classeAtual: formData.classeAtual || formData.classe || 'Amigo',
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Falha ao salvar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#1B3A6B]" />
            {isEdit ? 'Editar Dados do Desbravador' : 'Novo Cadastro de Desbravador'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preencha a ficha cadastral conforme os registos oficiais do clube e da igreja
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-95 disabled:opacity-50 cursor-pointer"
            style={{ background: '#1B3A6B' }}
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex flex-wrap gap-1 text-xs font-semibold shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('pessoal')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pessoal' ? 'bg-[#1B3A6B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Dados Pessoais
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contatos')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'contatos' ? 'bg-[#1B3A6B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          Encarregados & Residência
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clube')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'clube' ? 'bg-[#1B3A6B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Clube, Unidade & Classes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('batismo')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'batismo' ? 'bg-[#1B3A6B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          Batismo & Igreja
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('observacoes')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'observacoes' ? 'bg-[#1B3A6B] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Observações & Estado
        </button>
      </div>

      {/* Tab 1: Dados Pessoais */}
      {activeTab === 'pessoal' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Identificação do Desbravador
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="lg:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.nomeCompleto}
                onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                placeholder="Ex: João Manuel dos Santos"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Número de Identificação / ID Clube
              </label>
              <input
                type="text"
                value={formData.numeroIdentificacao}
                onChange={(e) => handleChange('numeroIdentificacao', e.target.value)}
                placeholder="Ex: DBV-2026-010"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-[#1B3A6B]/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleChange('dataNascimento', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sexo
              </label>
              <select
                value={formData.sexo}
                onChange={(e) => handleChange('sexo', e.target.value as 'M' | 'F' | '')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-[#1B3A6B]/20"
              >
                <option value="">Selecione...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cédula / B.I.
              </label>
              <input
                type="text"
                value={formData.cedula}
                onChange={(e) => handleChange('cedula', e.target.value)}
                placeholder="Ex: 009234589LA040"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-[#1B3A6B]/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Escola / Ano Escolar
              </label>
              <input
                type="text"
                value={formData.escola}
                onChange={(e) => handleChange('escola', e.target.value)}
                placeholder="Ex: Escola 1024 - 7ª Classe"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
              />
            </div>

            <div id="member-photo-upload-section" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block font-semibold text-slate-700 text-xs">
                  Fotografia do Desbravador (Padrão 3x4)
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Para exibição no perfil e fichas A4
                </span>
              </div>

              {/* Hidden native file input */}
              <input
                id="member-photo-file-input"
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handlePhotoFileChange}
              />

              {formData.foto ? (
                /* Selected Photo Preview Card */
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/80 shadow-xs">
                  <div className="relative shrink-0 w-24 h-32 rounded-xl overflow-hidden border-2 border-[#1B3A6B]/20 bg-slate-200 shadow-xs">
                    <img
                      src={formData.foto}
                      alt="Foto do desbravador"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      3x4
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Fotografia carregada e pronta para emissão oficial</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      A imagem será ajustada automaticamente ao cabeçalho oficial das fichas de inscrição e registo.
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        id="btn-replace-photo"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                        Substituir Foto
                      </button>
                      <button
                        type="button"
                        id="btn-remove-photo"
                        onClick={() => {
                          handleChange('foto', '');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Modern Drag-and-Drop / Click-to-Upload Dropzone */
                <div
                  id="member-photo-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handlePhotoDragOver}
                  onDragLeave={handlePhotoDragLeave}
                  onDrop={handlePhotoDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center ${
                    isDraggingPhoto
                      ? 'border-[#1B3A6B] bg-blue-50/70 scale-[1.008] shadow-sm'
                      : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-[#1B3A6B]/70 shadow-2xs'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1B3A6B]/10 border border-[#1B3A6B]/20 flex items-center justify-center text-[#1B3A6B] mb-2.5 shadow-2xs">
                    <Camera className="w-6 h-6 text-[#1B3A6B]" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Clique para carregar ou arraste a fotografia 3x4 aqui
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                    Suporta ficheiros de imagem (PNG, JPG, JPEG ou WEBP até 10MB). A proporção ideal é formato 3x4 vertical.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-[#1B3A6B] shadow-2xs">
                    <Upload className="w-3 h-3" />
                    Procurar no dispositivo
                  </div>
                </div>
              )}

              {/* Error feedback */}
              {photoUploadError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {photoUploadError}
                </div>
              )}

              {/* Secondary URL toggle */}
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-slate-500 hover:text-slate-800 underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  {showUrlInput ? 'Ocultar inserção por link' : 'Prefere colar link da foto em vez de carregar ficheiro?'}
                </button>
              </div>

              {showUrlInput && (
                <div className="pt-2">
                  <input
                    type="url"
                    value={formData.foto || ''}
                    onChange={(e) => handleChange('foto', e.target.value)}
                    placeholder="https://exemplo.com/foto-do-membro.jpg"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Cole o link direto da foto online (ex: Google Drive público, Dropbox, Imgur, etc.)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Encarregados & Residência */}
      {activeTab === 'contatos' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Encarregados de Educação & Contatos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Encarregado 1 (Pai / Tutor Principal)
                </label>
                <input
                  type="text"
                  value={formData.nomeEncarregado1}
                  onChange={(e) => handleChange('nomeEncarregado1', e.target.value)}
                  placeholder="Nome do Pai ou Tutor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Telefone do Encarregado 1 (Pai)
                </label>
                <input
                  type="text"
                  value={formData.contatoPai}
                  onChange={(e) => handleChange('contatoPai', e.target.value)}
                  placeholder="+244 9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Encarregado 2 (Mãe / Co-tutora)
                </label>
                <input
                  type="text"
                  value={formData.nomeEncarregado2}
                  onChange={(e) => handleChange('nomeEncarregado2', e.target.value)}
                  placeholder="Nome da Mãe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Telefone do Encarregado 2 (Mãe)
                </label>
                <input
                  type="text"
                  value={formData.contatoMae}
                  onChange={(e) => handleChange('contatoMae', e.target.value)}
                  placeholder="+244 9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Telefone Direto do Desbravador
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="+244 9..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Localização & Residência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="lg:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Endereço / Rua / Casa
                </label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleChange('endereco', e.target.value)}
                  placeholder="Rua, Casa nº, Ponto de referência"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => handleChange('bairro', e.target.value)}
                  placeholder="Bairro"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Município
                </label>
                <input
                  type="text"
                  value={formData.municipio}
                  onChange={(e) => handleChange('municipio', e.target.value)}
                  placeholder="Ex: Luanda, Belas, Cazenga"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Província
                </label>
                <input
                  type="text"
                  value={formData.provincia}
                  onChange={(e) => handleChange('provincia', e.target.value)}
                  placeholder="Ex: Luanda, Benguela, Huambo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Clube, Unidade & Classes */}
      {activeTab === 'clube' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Enquadramento no Clube
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unidade
                </label>
                <select
                  value={formData.unidade}
                  onChange={(e) => handleChange('unidade', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-[#1B3A6B]/20"
                >
                  {AVAILABLE_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Classe Atual
                </label>
                <select
                  value={formData.classeAtual || formData.classe}
                  onChange={(e) => {
                    handleChange('classeAtual', e.target.value);
                    handleChange('classe', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-[#1B3A6B]/20"
                >
                  {AVAILABLE_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      Classe {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cargo no Clube
                </label>
                <select
                  value={formData.cargo}
                  onChange={(e) => handleChange('cargo', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-[#1B3A6B]/20"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data de Entrada no Clube
                </label>
                <input
                  type="date"
                  value={formData.dataEntrada}
                  onChange={(e) => handleChange('dataEntrada', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data de Investidura da Classe Atual
                </label>
                <input
                  type="date"
                  value={formData.dataInvestidura}
                  onChange={(e) => handleChange('dataInvestidura', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>
            </div>
          </div>

          {/* Classes Anteriores Investidas */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
              Histórico de Classes Anteriores Investidas
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Registe as classes que o membro já concluiu com as respetivas datas de investidura
            </p>

            {/* List */}
            <div className="space-y-2 mb-4">
              {(formData.classesAnteriores || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Nenhuma classe anterior registada.
                </p>
              ) : (
                (formData.classesAnteriores || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">Classe {item.classe}</span>
                      <span className="text-slate-500 font-mono">Investidura: {item.data}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePreviousClass(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add row */}
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
              <select
                value={newPreviousClass}
                onChange={(e) => setNewPreviousClass(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                {AVAILABLE_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newPreviousDate}
                onChange={(e) => setNewPreviousDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
              />

              <button
                type="button"
                onClick={handleAddPreviousClass}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Classe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Batismo & Igreja */}
      {activeTab === 'batismo' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Dados Eclesiásticos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Igreja Local
                </label>
                <input
                  type="text"
                  value={formData.igreja}
                  onChange={(e) => handleChange('igreja', e.target.value)}
                  placeholder="IASD Central..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Distrito Eclesiástico
                </label>
                <input
                  type="text"
                  value={formData.distrito}
                  onChange={(e) => handleChange('distrito', e.target.value)}
                  placeholder="Distrito..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Região
                </label>
                <input
                  type="text"
                  value={formData.regiao}
                  onChange={(e) => handleChange('regiao', e.target.value)}
                  placeholder="Região 1..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Estado Batismal
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={formData.membroBaptizado}
                  onChange={(e) => handleChange('membroBaptizado', e.target.checked)}
                  className="w-4 h-4 rounded text-[#1B3A6B] focus:ring-[#1B3A6B]"
                />
                <span>Membro Batizado na Igreja Adventista do Sétimo Dia</span>
              </label>

              {formData.membroBaptizado && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Número da Certidão / Registo de Batismo
                    </label>
                    <input
                      type="text"
                      value={formData.numeroBaptismo}
                      onChange={(e) => handleChange('numeroBaptismo', e.target.value)}
                      placeholder="Ex: BAP-4521/2023"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-mono bg-white focus:ring-2 focus:ring-[#1B3A6B]/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Data do Batismo
                    </label>
                    <input
                      type="date"
                      value={formData.dataBaptismo}
                      onChange={(e) => handleChange('dataBaptismo', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-[#1B3A6B]/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Observações & Estado */}
      {activeTab === 'observacoes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Estado Cadastral do Membro
            </h3>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ativo"
                  checked={formData.ativo === true}
                  onChange={() => handleChange('ativo', true)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-bold text-emerald-700">Membro Ativo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ativo"
                  checked={formData.ativo === false}
                  onChange={() => handleChange('ativo', false)}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="font-bold text-amber-700">Membro Inativo / Afastado</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Observações Médicas, Histórico e Recomendações
            </label>
            <textarea
              rows={4}
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              placeholder="Indique alergias, tipo sanguíneo, medicamentos contínuos ou observações gerais de conduta e desenvolvimento..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#1B3A6B]/20"
            />
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-95 disabled:opacity-50 cursor-pointer"
          style={{ background: '#1B3A6B' }}
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Gravando...' : isEdit ? 'Salvar Dados' : 'Cadastrar Membro'}</span>
        </button>
      </div>
    </form>
  );
};

export default MemberForm;
