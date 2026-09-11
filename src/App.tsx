import React, { useState } from 'react';
import { ClubProvider, useClub } from './context/ClubContext';
import { Member } from './types';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MembersList } from './components/MembersList';
import { AttendanceManager } from './components/AttendanceManager';
import { UnitsClassesView } from './components/UnitsClassesView';
import { FeesManager } from './components/FeesManager';
import { MemberModal } from './components/MemberModal';
import { MemberProfileModal } from './components/MemberProfileModal';
import { Shield, RotateCcw, Compass, CheckCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { clubInfo, resetToDefaults } = useClub();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'members' | 'attendance' | 'units' | 'fees'>('dashboard');

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [memberToView, setMemberToView] = useState<Member | null>(null);

  const handleOpenAdd = () => {
    setMemberToEdit(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setMemberToEdit(member);
    setIsMemberModalOpen(true);
  };

  const handleOpenProfile = (member: Member) => {
    setMemberToView(member);
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração do clube? Todas as alterações manuais serão reiniciadas.')) {
      resetToDefaults();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddMember={handleOpenAdd}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAddMember={handleOpenAdd}
          />
        )}

        {currentTab === 'members' && (
          <MembersList
            onOpenAddMember={handleOpenAdd}
            onEditMember={handleOpenEdit}
            onViewProfile={handleOpenProfile}
          />
        )}

        {currentTab === 'attendance' && <AttendanceManager />}

        {currentTab === 'units' && <UnitsClassesView />}

        {currentTab === 'fees' && <FeesManager />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="text-slate-300 font-semibold">{clubInfo.name}</span>
            <span>&bull; {clubInfo.churchName} ({clubInfo.association})</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Restaurar dados padrão de exemplo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Dados Exemplo
            </button>
            <span className="text-slate-600">&bull;</span>
            <span>MVP v1.0.0.0</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />

      <MemberProfileModal
        member={memberToView}
        onClose={() => setMemberToView(null)}
        onEdit={(m) => {
          setMemberToView(null);
          handleOpenEdit(m);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ClubProvider>
      <MainContent />
    </ClubProvider>
  );
}
