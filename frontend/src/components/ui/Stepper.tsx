import React from 'react';
import { cn } from '../../lib/utils';

export type StepItem = {
  id: string;
  label: string;
  description?: string;
  state?: 'done' | 'current' | 'upcoming';
};

export const Stepper: React.FC<{ steps: StepItem[]; onStepClick?: (id: string) => void }> = ({
  steps,
  onStepClick,
}) => (
  <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
    {steps.map((step, index) => (
      <button
        type="button"
        key={step.id}
        onClick={() => onStepClick?.(step.id)}
        className={cn(
          'flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition md:w-[calc(50%-0.5rem)]',
          step.state === 'current'
            ? 'border-primary-500 bg-primary-50'
            : step.state === 'done'
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-slate-200 bg-white'
        )}
      >
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
            step.state === 'current'
              ? 'bg-primary-600 text-white'
              : step.state === 'done'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-200 text-slate-600'
          )}
        >
          {index + 1}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{step.label}</p>
          {step.description && <p className="text-xs text-slate-500">{step.description}</p>}
        </div>
      </button>
    ))}
  </div>
);
