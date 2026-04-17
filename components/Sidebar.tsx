import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart2,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  X,
  Zap,
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose }) => {

  const mainNavItems = [
    { id: ViewState.DASHBOARD,    label: 'Dashboard',             icon: <LayoutDashboard size={20} /> },
    { id: ViewState.LEADS,        label: 'Central de Leads',      icon: <Users size={20} />, beta: true },
    { id: ViewState.CAMPAIGNS,    label: 'Métricas de Campanhas', icon: <BarChart2 size={20} /> },
    { id: ViewState.REPORTS,      label: 'Relatórios',            icon: <FileText size={20} /> },
    { id: ViewState.SUBSCRIPTION, label: 'Assinatura',            icon: <CreditCard size={20} /> },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800 z-50
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative">
            <div className="absolute inset-0 bg-red-600 rounded-bl-xl rounded-tr-xl rotate-3 flex items-center justify-center text-white">
              <span className="font-bold text-xs">🐻</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none">Bear<br/>Lead</h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        {/* Navegação principal */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">Navegação</h3>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                  ${currentView === item.id
                    ? 'bg-red-700 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                {item.beta && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${currentView === item.id ? 'bg-white text-red-700' : 'bg-black text-white dark:bg-white dark:text-black'}`}>
                    Beta
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Seção de integrações */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">Integrações</h3>
          <nav className="space-y-1">
            <button
              onClick={() => onChangeView(ViewState.N8N_CONFIG)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                ${currentView === ViewState.N8N_CONFIG
                  ? 'bg-red-700 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <Zap size={20} />
              Configurar n8n
            </button>
          </nav>
        </div>
      </div>

      {/* Rodapé */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <Settings size={20} />
          Configurações
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
};
