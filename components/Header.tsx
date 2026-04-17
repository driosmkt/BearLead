import React, { useState, useRef, useEffect } from 'react';
import { Bell, Moon, Sun, PanelLeft, Check, Clock, User, Award } from 'lucide-react';
import { config } from '../config';

interface HeaderProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'Novo Lead Quente 🔥', text: 'Mariana Silva demonstrou alto interesse.', time: '2 min atrás', unread: true, icon: <User size={16} />, color: 'bg-red-100 text-red-600' },
    { id: 2, title: 'Visita Confirmada', text: 'Roberto Lima confirmou para amanhã às 14h.', time: '15 min atrás', unread: true, icon: <Clock size={16} />, color: 'bg-blue-100 text-blue-600' },
    { id: 3, title: 'Meta Batida! 🚀', text: 'Parabéns! Você atingiu 5 matrículas hoje.', time: '1h atrás', unread: false, icon: <Award size={16} />, color: 'bg-emerald-100 text-emerald-600' },
    { id: 4, title: 'Lead Recuperado', text: 'Fernando Souza voltou a interagir.', time: '3h atrás', unread: false, icon: <Check size={16} />, color: 'bg-amber-100 text-amber-600' },
    { id: 5, title: 'Campanha Otimizada', text: 'O custo por lead caiu 15% na última hora.', time: '5h atrás', unread: false, icon: <Award size={16} />, color: 'bg-purple-100 text-purple-600' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-40 transition-all duration-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <PanelLeft size={24} />
        </button>
        <div>
          <h2 className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm font-medium mb-0.5 lg:mb-1">{config.company.unit}</h2>
          <div className="flex items-center gap-2">
            <span className="bg-red-700 text-white text-xs lg:text-sm font-bold px-2 lg:px-3 py-0.5 lg:py-1 rounded-md whitespace-nowrap">
              Maple Bear Petrolina
            </span>
            <span className="hidden md:inline text-xs text-slate-400">Última atualização: há 5 min</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1">
          <button 
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'bg-white shadow-sm text-slate-600'}`}
          >
            <Moon size={16} />
          </button>
          <button 
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'text-slate-400 hover:text-amber-500' : 'bg-slate-700 shadow-sm text-amber-400'}`}
          >
            <Sun size={16} />
          </button>
        </div>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                {unreadCount}
              </div>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up origin-top-right">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-800 dark:text-white">Notificações</h3>
                <span className="text-xs text-red-600 dark:text-red-400 font-medium cursor-pointer hover:underline">Marcar todas como lidas</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                      {notif.icon}
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-bold ${notif.unread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{notif.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{notif.text}</p>
                    </div>
                    {notif.unread && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800">
                <button className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  Ver Histórico Completo
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-slate-200 dark:border-slate-700 cursor-pointer">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-lg">
            U
          </div>
          <span className="hidden md:inline text-slate-700 dark:text-slate-200 font-medium">Usuário</span>
        </div>
      </div>
    </header>
  );
};