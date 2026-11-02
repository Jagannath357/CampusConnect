import React from 'react';
import { Card } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  onClick,
}) => {
  const colorStyles = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    sky: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-5 transition-all hover:shadow-md border border-slate-200/80 dark:border-slate-800 dark:hover:border-slate-700',
        onClick && 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 active:scale-[0.99]'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('p-3 rounded-xl flex-shrink-0', colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

