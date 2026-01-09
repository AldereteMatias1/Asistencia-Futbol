import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAsistencias, fetchBajas, fetchGanadores } from '../features/stats/api';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';

export const StatsPage: React.FC = () => {
  const [tab, setTab] = React.useState('asistencias');
  const [limit, setLimit] = React.useState('100');
  const [minPartidos, setMinPartidos] = React.useState('1');

  const asistenciasQuery = useQuery({
    queryKey: ['stats', 'asistencias'],
    queryFn: fetchAsistencias,
  });

  const bajasQuery = useQuery({
    queryKey: ['stats', 'bajas'],
    queryFn: fetchBajas,
  });

  const ganadoresQuery = useQuery({
    queryKey: ['stats', 'ganadores', minPartidos, limit],
    queryFn: () =>
      fetchGanadores({
        minPartidos: Number(minPartidos) || 1,
        limit: Number(limit) || 100,
      }),
  });

  return (
    <div className="container-page space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Stats</h2>
        <p className="text-sm text-slate-500">Analizá asistencias, bajas y ganadores.</p>
      </div>

      <Tabs
        tabs={[
          { id: 'asistencias', label: 'Asistencias' },
          { id: 'bajas', label: 'Bajas' },
          { id: 'ganadores', label: 'Ganadores' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'ganadores' && (
        <Card className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              label="Mínimo de partidos"
              type="number"
              value={minPartidos}
              onChange={(e) => setMinPartidos(e.target.value)}
            />
            <Input
              label="Límite"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
            <Button
              variant="secondary"
              className="mt-6 w-full"
              onClick={() => ganadoresQuery.refetch()}
            >
              Aplicar
            </Button>
          </div>
        </Card>
      )}

      <Card className="space-y-3">
        {/* ===== DESKTOP ===== */}
        <div className="hidden md:block">
          {tab === 'asistencias' && (
            <Table headers={['Jugador', 'Total']}>
              {(asistenciasQuery.data ?? []).map((item) => (
                <tr key={item.jugadorId}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {item.jugadorNombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.total}
                  </td>
                </tr>
              ))}
            </Table>
          )}

          {tab === 'bajas' && (
            <Table headers={['Jugador', 'Total']}>
              {(bajasQuery.data ?? []).map((item) => (
                <tr key={item.jugadorId}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {item.jugadorNombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.total}
                  </td>
                </tr>
              ))}
            </Table>
          )}

          {tab === 'ganadores' && (
            <Table headers={['Equipo', 'Total']}>
              {(ganadoresQuery.data ?? []).map((item, index) => (
                <tr key={`${item.equipo}-${index}`}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {item.equipo}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.total}
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </div>

        {/* ===== MOBILE ===== */}
        <div className="space-y-3 md:hidden">
          {tab === 'asistencias' &&
            (asistenciasQuery.data ?? []).map((item) => (
              <div
                key={item.jugadorId}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.jugadorNombre}
                </p>
                <p className="text-xs text-slate-500">Total: {item.total}</p>
              </div>
            ))}

          {tab === 'bajas' &&
            (bajasQuery.data ?? []).map((item) => (
              <div
                key={item.jugadorId}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.jugadorNombre}
                </p>
                <p className="text-xs text-slate-500">Total: {item.total}</p>
              </div>
            ))}

          {tab === 'ganadores' &&
            (ganadoresQuery.data ?? []).map((item, index) => (
              <div
                key={`${item.equipo}-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.equipo}
                </p>
                <p className="text-xs text-slate-500">Total: {item.total}</p>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
