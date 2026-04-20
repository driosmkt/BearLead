import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: string;
  delay?: number;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendPositive,
  color = "primary",
  delay = 0
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card-glass p-6 group hover:shadow-xl hover:shadow-primary/5 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-${color}/10 text-${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${trendPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
            {trendPositive ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 font-display">{title}</p>
        <h3 className="text-3xl font-display font-extrabold dark:text-white tabular-nums">{value}</h3>
      </div>
    </motion.div>
  );
};
