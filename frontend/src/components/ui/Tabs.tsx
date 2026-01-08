import React from 'react';
import { cn } from '../../lib/utils';

type Tab = {
  id: string;
  label: string;
};

export const Tabs: React.FC<{
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}> = ({ tabs, active, onChange }) => (
  <div className="flex flex-wrap gap-2 rounded-full bg-slate-100 p-1">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={cn(
          'rounded-full px-3 py-1.5 text-xs font-semibold transition',
          active === tab.id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
