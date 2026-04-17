import React from 'react';
import { Bell, Search, Menu, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  return (
    <header className="sticky top-0 right-0 left-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-30 border-b border-slate-100 dark:border-slate-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSidebar}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sistema ao vivo</span>
          </div>
        </div>

        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar lead, responsável ou programa..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-primary/20 rounded-xl text-sm transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative group transition-all">
            <Bell size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-slate-950" />
          </button>
          
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-900 mx-1" />
          
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold dark:text-white">Douglas Rios</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              DR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
