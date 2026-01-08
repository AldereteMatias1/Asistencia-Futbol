import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAdmin } from './providers/AdminProvider';
import { cn } from '../lib/utils';
import { AdminKeyPanel } from '../components/ui/AdminKeyPanel';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/jugadores', label: 'Jugadores' },
  { to: '/partidos', label: 'Partidos' },
  { to: '/stats', label: 'Stats' },
];

export const Layout: React.FC = () => {
  const { isAdmin } = useAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:border-slate-200 md:bg-white">
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase text-slate-500">Estadísticas</p>
            <h1 className="text-lg font-semibold text-slate-900">Partidos</h1>
          </div>
          {isAdmin && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              ADMIN
            </span>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-6">
          <AdminKeyPanel />
        </div>
      </div>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold">Estadísticas</h1>
            {isAdmin && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                ADMIN
              </span>
            )}
          </div>
          <div className="mt-3">
            <AdminKeyPanel compact />
          </div>
        </header>
        <main className="pb-20 md:pb-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-2 py-2 text-center text-xs font-medium',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
