import React from 'react';
import { useAdmin } from '../../app/providers/AdminProvider';
import { Button } from './Button';
import { Input } from './Input';

export const AdminKeyPanel: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { adminKey, isAdmin, setAdminKey, logout } = useAdmin();
  const [value, setValue] = React.useState(adminKey ?? '');

  React.useEffect(() => {
    setValue(adminKey ?? '');
  }, [adminKey]);

  if (isAdmin) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
        <p className="text-xs font-semibold text-emerald-700">Modo admin activo</p>
        <p className="mt-1 truncate text-xs text-emerald-600">Key guardada</p>
        <Button variant="ghost" size={compact ? 'sm' : 'md'} className="mt-2 w-full" onClick={logout}>
          Salir
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-xs font-semibold text-slate-700">Modo admin</p>
      <div className="mt-2 flex flex-col gap-2">
        <Input
          type="password"
          placeholder="Pegá tu API key"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button
          size={compact ? 'sm' : 'md'}
          className="w-full"
          onClick={() => value && setAdminKey(value)}
        >
          Activar
        </Button>
      </div>
    </div>
  );
};
