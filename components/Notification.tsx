import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  type?: NotificationType;
  title?: string;
  message: string;
  autoClose?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  autoClose = 5000,
}) => {
  useEffect(() => {
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-800 dark:text-emerald-200',
      icon: <CheckCircle className="text-emerald-500 dark:text-emerald-400" size={20} />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/40',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: <AlertCircle className="text-red-500 dark:text-red-400" size={20} />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/40',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      icon: <AlertTriangle className="text-amber-500 dark:text-amber-400" size={20} />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/40',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="text-blue-500 dark:text-blue-400" size={20} />,
    },
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-[60] max-w-sm w-full animate-slide-up pointer-events-none">
      <div className={`pointer-events-auto relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${styles.bg} ${styles.border}`}>
        <div className="shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <div className="flex-1 mr-2">
          {title && (
            <h4 className={`text-sm font-bold mb-1 ${styles.text}`}>
              {title}
            </h4>
          )}
          <p className={`text-sm opacity-90 leading-relaxed ${styles.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${styles.text}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};