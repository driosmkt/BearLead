import React from 'react';
import { LayoutDashboard, Users, Megaphone, FileBarChart, CreditCard, LogOut, Moon, Sun, X, Workflow } from 'lucide-react';
import { ViewState } from '../types';
import { useLeadsContext } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps { isOpen: boolean; onClose: () => void; }

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView } = useLeadsContext();
  const { user, signOut, isAdmin } = useAuth();
  const [isDarkMode, setIsDarkMode] = React.useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const menuItems = [
    { id: ViewState.DASHBOARD,    label: 'Dashboard',        icon: LayoutDashboard },
    { id: ViewState.LEADS,        label: 'Central de Leads', icon: Users },
    { id: ViewState.CAMPAIGNS,    label: 'Campanhas',        icon: Megaphone },
    { id: ViewState.REPORTS,      label: 'Relatórios',       icon: FileBarChart },
    { id: ViewState.SUBSCRIPTION, label: 'Assinatura',       icon: CreditCard },
  ];

  const integrationItems = [
    { id: ViewState.N8N_CONFIG, label: 'Configurar n8n', icon: Workflow },
  ];

  const bottomItems = [
    { id: ViewState.TEAM,     label: 'Equipe',         icon: Users },
    { id: ViewState.SETTINGS, label: 'Configurações',  icon: Workflow },
  ];

  const _ignore = [
  ];

  const NavItem = ({ item }: { item: any }) => {
    const active = currentView === item.id;
    const Icon = item.icon;
    return (
      <button
        onClick={() => { if (!item.disabled) { setCurrentView(item.id); if (window.innerWidth < 768) onClose(); } }}
        disabled={item.disabled}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
          ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-[1.02]' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}
          ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Icon size={20} className={active ? 'text-white' : 'group-hover:text-red-600 transition-colors'} />
        <span className="font-medium">{item.label}</span>
        {item.disabled && <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">Breve</span>}
      </button>
    );
  };

  // Extrai nome do email (parte antes do @)
  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]?.replace(/[._]/g, ' ')
    || 'Usuário';
  const displayEmail = user?.email || '';

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">

          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                <Users size={20} />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight dark:text-white">Bear Lead</h1>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Petrolina (PE)</p>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-slate-400"><X size={20} /></button>
          </div>

          {/* Usuário logado */}
          <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate capitalize">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">Navegação</p>
              <div className="space-y-1">{menuItems.map(item => <NavItem key={item.id} item={item} />)}</div>
            </div>
            {isAdmin && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">Integrações</p>
              <div className="space-y-1">{integrationItems.map(item => <NavItem key={item.id} item={item} />)}</div>
            </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">Conta</p>
              <div className="space-y-1">
                {bottomItems
                  .filter(item => item.id !== 'TEAM' || isAdmin)
                  .map(item => <NavItem key={item.id} item={item} />)
                }
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-900 space-y-2">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                onClick={toggleDarkMode}
                className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-red-600' : 'bg-slate-200'}`}
                aria-label="Alternar modo escuro"
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all duration-300 flex items-center justify-center ${isDarkMode ? 'left-6 bg-white' : 'left-1 bg-white'}`}>
                  {isDarkMode ? <Moon size={9} className="text-red-600" /> : <Sun size={9} className="text-amber-500" />}
                </div>
              </button>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};
