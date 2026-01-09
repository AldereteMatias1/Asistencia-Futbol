import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchJugadores } from '../features/jugadores/api';
import { fetchPartidos } from '../features/partidos/api';
import { fetchAsistencias, fetchBajas, fetchGanadores } from '../features/stats/api';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { API_BASE_URL } from '../config';
import { Button } from '../components/ui/Button';

const TopList: React.FC<{
  title: string;
  headers: string[];
  rows: Array<{ key: string; cols: React.ReactNode[] }>;
}> = ({ title, headers, rows }) => (
  <Card className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    </div>
    <div className="hidden md:block">
      <Table headers={headers}>
        {rows.map((row) => (
          <tr key={row.key}>
            {row.cols.map((col, index) => (
              <td key={index} className="px-4 py-3 text-sm text-slate-600">
                {col}
              </td>
            ))}
          </tr>
        ))}
      </Table>
    </div>
    <div className="space-y-3 md:hidden">
      {rows.map((row) => (
        <div key={row.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          {row.cols.map((col, index) => (
            <div key={index} className={index === 0 ? 'text-sm font-semibold text-slate-900' : 'text-xs text-slate-500'}>
              {col}
            </div>
          ))}
        </div>
      ))}
    </div>
  </Card>
);

export const DashboardPage: React.FC = () => {
  const jugadoresQuery = useQuery({ queryKey: ['jugadores'], queryFn: fetchJugadores });
  const partidosQuery = useQuery({ queryKey: ['partidos'], queryFn: () => fetchPartidos() });
  const asistenciasQuery = useQuery({ queryKey: ['stats', 'asistencias'], queryFn: fetchAsistencias });
  const bajasQuery = useQuery({ queryKey: ['stats', 'bajas'], queryFn: fetchBajas });
  const ganadoresQuery = useQuery({
    queryKey: ['stats', 'ganadores', 1, 10],
    queryFn: () => fetchGanadores({ minPartidos: 1, limit: 10 }),
  });

const totalAsistencias =
  asistenciasQuery.data?.reduce((acc, item) => acc + item.asistencias, 0) ?? 0;

const totalBajas =
  bajasQuery.data?.reduce((acc, item) => acc + item.bajas, 0) ?? 0;


  const isLoading =
    jugadoresQuery.isLoading ||
    partidosQuery.isLoading ||
    asistenciasQuery.isLoading ||
    bajasQuery.isLoading ||
    ganadoresQuery.isLoading;

  const hasError =
    jugadoresQuery.isError ||
    partidosQuery.isError ||
    asistenciasQuery.isError ||
    bajasQuery.isError ||
    ganadoresQuery.isError;

  return (
    <div className="container-page space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500">Resumen rápido de la actividad.</p>
        </div>
        <a
          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          href={`${API_BASE_URL}/api`}
          target="_blank"
          rel="noreferrer"
        >
          Ver Swagger
        </a>
      </div>

      {hasError && (
        <Card className="space-y-3">
          <p className="text-sm text-rose-600">No pudimos cargar los datos.</p>
          <Button
            variant="secondary"
            onClick={() => {
              jugadoresQuery.refetch();
              partidosQuery.refetch();
              asistenciasQuery.refetch();
              bajasQuery.refetch();
              ganadoresQuery.refetch();
            }}
          >
            Reintentar
          </Button>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-xs uppercase text-slate-500">Jugadores</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {isLoading ? '...' : jugadoresQuery.data?.length ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-500">Partidos</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {isLoading ? '...' : partidosQuery.data?.length ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-500">Asistencias</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{isLoading ? '...' : totalAsistencias}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-slate-500">Bajas</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{isLoading ? '...' : totalBajas}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TopList
          title="Top 10 asistencias"
          headers={['Jugador', 'Total']}
          rows={(asistenciasQuery.data ?? []).slice(0, 10).map((item) => ({
            key: String(item.jugadorId),
            cols: [`${item.nombre} ${item.apellido}`, item.asistencias],
          }))}

        />
        <TopList
          title="Top 10 bajas"
          headers={['Jugador', 'Total']}
          rows={(bajasQuery.data ?? []).slice(0, 10).map((item) => ({
            key: String(item.jugadorId),
            cols: [`${item.nombre} ${item.apellido}`, item.bajas],
          }))}

        />
        <TopList
          title="Top ganadores (winrate)"
          headers={['Jugador', 'Winrate']}
          rows={(ganadoresQuery.data ?? []).map((item) => ({
            key: String(item.jugadorId),
            cols: [`${item.nombre} ${item.apellido}`, `${item.winrate.toFixed(2)}%`],
          }))}
        />

      </div>
    </div>
  );
};
