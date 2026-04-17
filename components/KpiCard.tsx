import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricCardProps } from '../types';

export const KpiCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trendValue,
  trendDirection,
  statusLabel,
  statusColor,
  icon,
  iconBgColor = 'bg-red-50',
  iconColor = 'text-red-600'
}) => {
  const getStatusColor = () => {
    switch (statusColor) {
      case 'red': return 'bg-red-600 text-white dark:bg-red-700';
      case 'yellow': return 'bg-amber-500 text-white dark:bg-amber-600';
      case 'green': return 'bg-emerald-500 text-white dark:bg-emerald-600';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-emerald-500 dark:text-emerald-400';
      case 'down': return 'text-red-500 dark:text-red-400';
      default: return 'text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</span>
        <div className={`p-2 rounded-lg ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{value}</div>
        <div className={`flex items-center gap-1 text-sm font-medium mb-4 ${getTrendColor()}`}>
          {trendDirection === 'up' && <TrendingUp size={16} />}
          {trendDirection === 'down' && <TrendingDown size={16} />}
          {trendDirection === 'neutral' && <Minus size={16} />}
          <span>{trendValue}</span>
        </div>
      </div>

      <div className={`py-1.5 px-4 rounded-full text-xs font-bold inline-block text-center w-full ${getStatusColor()}`}>
        {statusLabel}
      </div>
    </div>
  );
};