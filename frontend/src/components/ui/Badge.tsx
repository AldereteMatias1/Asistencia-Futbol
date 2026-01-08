import React from 'react';
import { cn } from '../../lib/utils';

type BadgeProps = {
  children: React.ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'info';
};

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'default' }) => {
  const tones = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-primary-100 text-primary-700',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  );
};
