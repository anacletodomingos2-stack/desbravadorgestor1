import React from 'react';
import { NavPage } from '../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  History,
  X,
  Database,
  LogIn,
  LogOut,
} from 'lucide-react';
import { desbravadoresD4Img, iasdLogoImg } from './OfficialPdfIcons';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  current: NavPage;
  onNav: (p: NavPage, id?: string) => void;
  totalMembers: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  current,
  onNav,
  totalMembers,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { user, signInWithGoogle, logout, loading: authLoading } = useAuth();
  const menuItems: { id: NavPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'membros',
      label: 'Membros',
      icon: <Users className="w-4 h-4" />,
      badge: totalMembers,
    },
    {
      id: 'cadastrar',
      label: 'Novo Cadastro',
      icon: <UserPlus className="w-4 h-4" />,
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'auditoria',
      label: 'Auditoria',
      icon: <History className="w-4 h-4" />,
    },
  ];

  const handleItemClick = (page: NavPage) => {
    onNav(page);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#1B3A6B' }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shadow-md shrink-0">
              <img
                src={desbravadoresD4Img}
                alt="Emblema Desbravadores"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">DesbravadorGestor</h1>
              <p className="text-[11px] text-white/70 font-medium">Portal de Gestão & Fichas</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Club Info Badge */}
        <div className="px-5 py-3 border-b border-white/10 bg-black/10 flex items-center justify-between">
          <div>
            <span className="text-white/90 font-bold text-xs block">Clube Pioneiros da Fé</span>
            <p className="text-[10.5px] text-white/60 mt-0.5">Missão Norte &bull; Min. Jovem</p>
          </div>
          <div className="w-6 h-8 flex items-center justify-center shrink-0">
            <img
              src={iasdLogoImg}
              alt="IASD"
              className="max-w-full max-h-full object-contain brightness-200 contrast-125 opacity-90"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = current === item.id || (item.id === 'membros' && current === 'detalhe');

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1B3A6B] shadow-sm font-bold'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#1B3A6B]' : 'text-white/70'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#1B3A6B] text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cloud SQL Database & Auth status */}
        <div className="p-3 border-t border-white/10 bg-black/15 text-xs text-white/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>PostgreSQL Ativo</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {user ? (
            <div className="bg-white/10 rounded-xl p-2.5 space-y-1.5 border border-white/10">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Utilizador'}
                    className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-semibold text-white truncate text-[11px]">
                    {user.displayName || 'Gestor Autenticado'}
                  </p>
                  <p className="text-[10px] text-white/60 truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="w-full mt-1 inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold text-white/80 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Terminar Sessão
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={authLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#1B3A6B] bg-white hover:bg-slate-100 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5 text-[#1B3A6B]" />
              <span>Entrar com Google</span>
            </button>
          )}

          <p className="text-[10px] text-white/50 text-center">
            Sincronização em nuvem Cloud SQL ativa
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
