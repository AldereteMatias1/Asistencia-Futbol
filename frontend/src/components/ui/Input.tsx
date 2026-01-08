import React from 'react';
import { cn } from '../../lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <label className="flex w-full flex-col gap-1 text-sm">
      {label && <span className="font-medium text-slate-700">{label}</span>}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
          error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-100',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  )
);
Input.displayName = 'Input';
