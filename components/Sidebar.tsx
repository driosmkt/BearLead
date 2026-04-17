import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  FileBarChart, 
  CreditCard, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  X,
  Workflow
} from 'lucide-react';
import { ViewState } from '../types';
import { useLeadsContext } from '../context/LeadsContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView } = useLeadsContext();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.LEADS, label: 'Central de Leads', icon: Users },
    { id: ViewState.CAMPAIGNS, label: 'Campanhas', icon: Megaphone },
    { id: ViewState.REPORTS, label: 'Relatórios', icon: FileBarChart, disabled: true },
    { id: ViewState.SUBSCRIPTION, label: 'Assinatura', icon: CreditCard },
  ];

  const integrationItems = [
    { id: ViewState.N8N_CONFIG, label: 'Configurar n8n', icon: Workflow },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const active = currentView === item.id;
    const Icon = item.icon;
    
    return (
      <button
        onClick={() => {
          if (!item.disabled) {
            setCurrentView(item.id);
            if (window.innerWidth < 768) onClose();
          }
        }}
        disabled={item.disabled}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
          ${active 
            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}
          ${item.disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        `}
      >
        <Icon size={20} className={active ? 'text-white' : 'group-hover:text-primary transition-colors'} />
        <span className="font-medium">{item.label}</span>
        {item.disabled && (
          <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">Breve</span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 z-50 transition-transform duration-300 md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Users size={24} weight="bold" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight dark:text-white">Bear Lead</h1>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Petrolina (PE)</p>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto pr-2 -mr-2">
            {/* Navigation */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4 font-display">Navegação</p>
              <div className="space-y-1">
                {menuItems.map(item => <NavItem key={item.id} item={item} />)}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4 font-display">Integrações</p>
              <div className="space-y-1">
                {integrationItems.map(item => <NavItem key={item.id} item={item} />)}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-900 space-y-4">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button 
                onClick={toggleDarkMode}
                className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative transition-colors"
                aria-label="Toggle Dark Mode"
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white dark:bg-primary shadow transition-all duration-300 transform ${isDarkMode ? 'translate-x-4' : ''}`}>
                  {isDarkMode ? <Moon size={10} className="text-white m-0.5" /> : <Sun size={10} className="text-amber-500 m-0.5" />}
                </div>
              </button>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
