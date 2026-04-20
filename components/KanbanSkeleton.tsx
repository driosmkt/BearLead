import React from 'react';

const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24" />
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12" />
    </div>
    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-32" />
    <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-20" />
    <div className="flex items-center justify-between pt-1">
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-16" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-12" />
    </div>
  </div>
);

const ColumnSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => (
  <div className="flex-1 min-w-[240px] flex flex-col rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
      </div>
      <div className="h-5 w-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
    </div>
    <div className="px-3 pb-3 space-y-3">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  </div>
);

export const KanbanSkeleton: React.FC = () => (
  <div className="flex gap-6 min-w-[1400px] h-full">
    <ColumnSkeleton count={2} />
    <ColumnSkeleton count={1} />
    <ColumnSkeleton count={3} />
    <ColumnSkeleton count={0} />
    <ColumnSkeleton count={1} />
    <ColumnSkeleton count={0} />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse">
    {/* KPIs */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-24" />
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-16" />
        </div>
      ))}
    </div>
    {/* Gráfico + Calendário */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-48 mb-8" />
        <div className="h-[220px] bg-slate-50 dark:bg-slate-800 rounded-xl" />
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-32 mb-6" />
        <div className="grid grid-cols-7 gap-1">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
