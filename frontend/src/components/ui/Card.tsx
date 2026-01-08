import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={cn('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm', className)}>{children}</div>;
