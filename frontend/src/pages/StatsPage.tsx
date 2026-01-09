import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAsistencias, fetchBajas, fetchGanadores } from '../features/stats/api';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';

type AsistenciaRow = {
  jugadorId: string;
  nombre: string;
  apellido: string;
  asistencias: number;
};

type BajasRow = {
  jugadorId: string;
  nombre: string;
  apellido: string;
  bajas: number;
};

type GanadoresRow = {
  jugadorId: string;
  nombre: string;
  apellido: string;
  partidosJugados: number;
  victorias: number;
  winrate: number; // 66.67
};

export const StatsPage: React.FC = () => {
  const [tab, setTab] = React.useState<'asistencias' | 'bajas' | 'ganadores'>('asistencias');
  const [limit, setLimit] = React.useState('50');
  const [minPartidos, setMinPartidos] = React.useState('1');

  const asistenciasQuery = useQuery({
    queryKey: ['stats', 'asistencias', limit],
    queryFn: () => fetchAsistencias() as Promise<AsistenciaRow[]>,
  });

  const bajasQuery = useQuery({
    queryKey: ['stats', 'bajas', limit],
    queryFn: () => fetchBajas() as Promise<BajasRow[]>,
  });

  const ganadoresQuery = useQuery({
    queryKey: ['stats', 'ganadores', minPartidos, limit],
    queryFn: () =>
      fetchGanadores({
        minPartidos: Number(minPartidos) || 1,
        limit: Number(limit) || 50,
      }) as Promise<GanadoresRow[]>,
  });

  const fullName = (row: { nombre: string; apellido: string }) => `${row.nombre} ${row.apellido}`.trim();

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
        onChange={(v) => setTab(v as any)}
      />

      {/* Filtros */}
      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            label="Límite"
            type="number"
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
          />

          {tab === 'ganadores' ? (
            <Input
              label="Mínimo de partidos"
              type="number"
              value={minPartidos}
              onChange={(event) => setMinPartidos(event.target.value)}
            />
          ) : (
            <div />
          )}

          <Button
            variant="secondary"
            className="mt-6 w-full"
            onClick={() => {
              if (tab === 'asistencias') asistenciasQuery.refetch();
              if (tab === 'bajas') bajasQuery.refetch();
              if (tab === 'ganadores') ganadoresQuery.refetch();
            }}
          >
            Aplicar
          </Button>
        </div>
      </Card>

      {/* Tabla (desktop) */}
      <Card className="space-y-3">
        <div className="hidden md:block">
          {tab === 'asistencias' && (
            <Table headers={['Jugador', 'Asistencias']}>
              {(asistenciasQuery.data ?? []).map((item) => (
                <tr key={item.jugadorId}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {item.nombre} {item.apellido}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.asistencias}</td>
                </tr>
              ))}
            </Table>
          )}

          {tab === 'bajas' && (
            <Table headers={['Jugador', 'Bajas']}>
              {(bajasQuery.data ?? []).map((item) => (
                <tr key={item.jugadorId}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {item.nombre} {item.apellido}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.bajas}</td>
                </tr>
              ))}
            </Table>
          )}

          {tab === 'ganadores' && (
            <Table headers={['Jugador', 'PJ', 'Victorias', 'Winrate']}>
              {(ganadoresQuery.data ?? []).map((item) => (
                <tr key={item.jugadorId}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {item.nombre} {item.apellido}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.partidosJugados}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.victorias}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{item.winrate.toFixed(2)}%</td>
                </tr>
              ))}
            </Table>
          )}
        </div>

        {/* Cards (mobile) */}
        <div className="space-y-3 md:hidden">
          {tab === 'asistencias' &&
            (asistenciasQuery.data ?? []).map((item) => (
              <div key={item.jugadorId} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">{item.nombre} {item.apellido}</p>
                <p className="text-xs text-slate-500">Asistencias: {item.asistencias}</p>
              </div>
            ))}

          {tab === 'bajas' &&
            (bajasQuery.data ?? []).map((item) => (
              <div key={item.jugadorId} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">{item.nombre} {item.apellido}</p>
                <p className="text-xs text-slate-500">Bajas: {item.bajas}</p>
              </div>
            ))}

          {tab === 'ganadores' &&
            (ganadoresQuery.data ?? []).map((item) => (
              <div key={item.jugadorId} className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-sm font-semibold text-slate-900">{item.nombre} {item.apellido}</p>
                <p className="text-xs text-slate-500">PJ: {item.partidosJugados} · Victorias: {item.victorias}</p>
                <p className="text-xs text-slate-500">Winrate: {item.winrate.toFixed(2)}%</p>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
