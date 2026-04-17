import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'alert' | 'success';
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, children, icon, variant = 'default' }) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'alert': return 'border-red-200 bg-red-50';
      case 'success': return 'border-emerald-200 bg-white';
      default: return 'border-gray-100 bg-white';
    }
  };

  const getTitleColor = () => {
    switch (variant) {
      case 'alert': return 'text-red-700';
      case 'success': return 'text-emerald-800';
      default: return 'text-slate-800';
    }
  };

  return (
    <div className={`p-8 rounded-2xl border-2 shadow-sm ${getBorderColor()} h-full transition-all hover:shadow-md`}>
      <div className="flex items-center gap-4 mb-6">
        {icon && <div className={`${variant === 'alert' ? 'text-red-500' : 'text-emerald-600'}`}>{icon}</div>}
        <h3 className={`text-2xl font-bold ${getTitleColor()}`}>{title}</h3>
      </div>
      <div className="text-xl text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
};