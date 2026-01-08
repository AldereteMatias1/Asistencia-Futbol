import React from 'react';

export const Table: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-4 py-3 text-left font-semibold text-slate-600">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
    </table>
  </div>
);
