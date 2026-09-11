import React from 'react';
import { useClub } from '../context/ClubContext';
import { 
  Shield, 
  Users, 
  CalendarCheck, 
  Layers, 
  CreditCard, 
  Plus, 
  LayoutDashboard,
  Compass
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'members' | 'attendance' | 'units' | 'fees';
  setCurrentTab: (tab: 'dashboard' | 'members' | 'attendance' | 'units' | 'fees') => void;
  onOpenAddMember: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, onOpenAddMember }) => {
  const { clubInfo, members } = useClub();
  const activeCount = members.filter((m) => m.isActive).length;

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'members', label: 'Membros', icon: Users, count: activeCount },
    { id: 'attendance', label: 'Presenças', icon: CalendarCheck },
    { id: 'units', label: 'Unidades & Classes', icon: Layers },
    { id: 'fees', label: 'Mensalidades', icon: CreditCard },
  ] as const;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top branding bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm font-bold">
              <Shield className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  Desbravador Gestor
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    MVP v1.0
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" />
                {clubInfo.name} &bull; {clubInfo.churchName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-quick-add-member"
              onClick={onOpenAddMember}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Novo Membro
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {'count' in item && item.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
