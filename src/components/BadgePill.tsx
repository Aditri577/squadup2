import React from 'react';
import { BadgeLevel } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, Star } from 'lucide-react';

interface BadgePillProps {
  level: BadgeLevel;
  scorePercent?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgePill: React.FC<BadgePillProps> = ({ 
  level, 
  scorePercent, 
  showScore = false,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-bold'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const iconSize = iconSizes[size];

  if (level === 'Green') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]} shadow-xs`}>
        <ShieldCheck size={iconSize} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Green Badge (Advanced)</span>
        {showScore && scorePercent !== undefined && (
          <span className="ml-1 opacity-80 border-l border-emerald-500/30 pl-1">{scorePercent}%</span>
        )}
      </span>
    );
  }

  if (level === 'Yellow') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 ${sizeClasses[size]} shadow-xs`}>
        <CheckCircle2 size={iconSize} className="text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Yellow Badge (Intermediate)</span>
        {showScore && scorePercent !== undefined && (
          <span className="ml-1 opacity-80 border-l border-amber-500/30 pl-1">{scorePercent}%</span>
        )}
      </span>
    );
  }

  if (level === 'Red') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 ${sizeClasses[size]} shadow-xs`}>
        <AlertTriangle size={iconSize} className="text-rose-600 dark:text-rose-400 shrink-0" />
        <span>Red Badge (Basic)</span>
        {showScore && scorePercent !== undefined && (
          <span className="ml-1 opacity-80 border-l border-rose-500/30 pl-1">{scorePercent}%</span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 ${sizeClasses[size]}`}>
      <Star size={iconSize} className="text-slate-400 shrink-0" />
      <span>Self-Claimed</span>
    </span>
  );
};
