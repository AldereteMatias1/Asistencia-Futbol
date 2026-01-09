import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchPartido,
  iniciarPartido,
  finalizarPartido,
  anotarJugador,
  bajaJugador,
  reactivarJugador,
  cambiarEquipo,
} from '../features/partidos/api';
import { fetchJugadores } from '../features/jugadores/api';
import { Card } from '../components/ui/Card';
import { Stepper, StepItem } from '../components/ui/Stepper';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { useAdmin } from '../app/providers/AdminProvider';
import { handleApiError } from '../lib/handleApiError';
import { formatDateTime } from '../lib/utils';
import { Participacion } from '../lib/types';

export const PartidoDetailPage: React.FC = () => {
  const { id } = useParams();
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();

  const [selectedTeam, setSelectedTeam] = React.useState<'A' | 'B'>('A');
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState('presentes');
  const [winner, setWinner] = React.useState<'A' | 'B' | 'EMPATE'>('A');

  const [teamModal, setTeamModal] = React.useState<{
    open: boolean;
    participacion?: Participacion;
    action?: 'reactivar' | 'cambiar';
  }>({ open: false });

  const [selectedDraft, setSelectedDraft] = React.useState<
    Array<{ jugadorId: string; equipo: 'A' | 'B' }>
  >([]);

  const partidoQuery = useQuery({
    queryKey: ['partido', id],
    queryFn: () => fetchPartido(id ?? ''),
    enabled: Boolean(id),
  });

  const jugadoresQuery = useQuery({
    queryKey: ['jugadores'],
    queryFn: fetchJugadores,
  });

  const iniciarMutation = useMutation({
    mutationFn: () => iniciarPartido(id ?? ''),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partido', id] });
    },
    onError: handleApiError,
  });

  const finalizarMutation = useMutation({
    mutationFn: (payload: { ganador: 'A' | 'B' | 'EMPATE' }) =>
      finalizarPartido(id ?? '', payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partido', id] });
    },
    onError: handleApiError,
  });

  const anotarMutation = useMutation({
    mutationFn: async (payload: { jugadorId: string; equipo: 'A' | 'B' }[]) => {
      await Promise.all(payload.map((item) => anotarJugador(id ?? '', item)));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partido', id] });
      const element = document.getElementById('iniciar');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    onError: handleApiError,
  });

  const bajaMutation = useMutation({
    mutationFn: (payload: { participacionId: string }) =>
      bajaJugador(id ?? '', payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partido', id] });
    },
    onError: handleApiError,
  });

  const reactivarMutation = useMutation({
    mutationFn: (payload: { participacionId: string; equipo?: 'A' | 'B' }) =>
      reactivarJugador(id ?? '', payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partido', id] });
    },
    onError: handleApiError,
  });

  const cambiarEquipoMutation = useMutation({
    mutationFn: (payload: { participacionId: string; equipo: 'A' | 'B' }) =>
      cambiarEquipo(id ?? '', payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['partido', id] });
    },
    onError: handleApiError,
  });

  const partido = partidoQuery.data;

  const participaciones = partido?.participaciones ?? [];
  const presentes = participaciones.filter((item) => item.activo);
  const bajas = participaciones.filter((item) => !item.activo);

  // ✅ sincronizar SIEMPRE el draft con las participaciones del backend
  React.useEffect(() => {
    if (!partido) return;
    const base = (partido.participaciones ?? []).map((p) => ({
      jugadorId: String(p.jugadorId),
      equipo: p.equipo as 'A' | 'B',
    }));
    setSelectedDraft(base);
  }, [partido?.id, partido?.participaciones?.length]);

  const jugadoresActivos = (jugadoresQuery.data ?? []).filter((jugador) => jugador.activo);

  const selectedIds = new Set(participaciones.map((item) => String(item.jugadorId)));

  const filteredJugadores = jugadoresActivos.filter((jugador) =>
    jugador.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const confirmSeleccion = () => {
    const newEntries = selectedDraft.filter((item) => !selectedIds.has(String(item.jugadorId)));
    if (newEntries.length === 0) return;
    anotarMutation.mutate(newEntries);
  };

  const handleAdd = (jugadorId: string) => {
    if (selectedDraft.some((item) => item.jugadorId === jugadorId)) return;
    setSelectedDraft((prev) => [...prev, { jugadorId, equipo: selectedTeam }]);
  };

  const handleRemove = (jugadorId: string) => {
    setSelectedDraft((prev) => prev.filter((item) => item.jugadorId !== jugadorId));
  };

  const equipoA = selectedDraft.filter((item) => item.equipo === 'A');
  const equipoB = selectedDraft.filter((item) => item.equipo === 'B');

  const steps: StepItem[] = [
    { id: 'crear', label: 'Crear', description: 'Datos iniciales', state: 'done' },
    { id: 'jugadores', label: 'Jugadores', description: 'Seleccionar equipos', state: 'upcoming' },
    { id: 'iniciar', label: 'Iniciar', description: 'Poner en juego', state: 'upcoming' },
    { id: 'gestionar', label: 'Gestionar', description: 'Bajas y cambios', state: 'upcoming' },
    { id: 'finalizar', label: 'Finalizar', description: 'Cerrar partido', state: 'upcoming' },
  ];

  if (partido) {
    const hasJugadores = participaciones.length > 0;

    steps[1].state = hasJugadores ? 'done' : 'current';

    if (partido.estado === 'PROGRAMADO') {
      steps[2].state = hasJugadores ? 'current' : 'upcoming';
    }
    if (partido.estado === 'EN_JUEGO') {
      steps[2].state = 'done';
      steps[3].state = 'current';
    }
    if (partido.estado === 'FINALIZADO') {
      steps[2].state = 'done';
      steps[3].state = 'done';
      steps[4].state = 'current';
    }
  }

  const handleTeamAction = (action: 'reactivar' | 'cambiar', participacion: Participacion) => {
    setTeamModal({ open: true, participacion, action });
  };

  const submitTeamAction = (team: 'A' | 'B') => {
    if (!teamModal.participacion || !teamModal.action) return;

    if (teamModal.action === 'reactivar') {
      reactivarMutation.mutate({ participacionId: teamModal.participacion.id, equipo: team });
    } else {
      cambiarEquipoMutation.mutate({ participacionId: teamModal.participacion.id, equipo: team });
    }

    setTeamModal({ open: false });
  };

  if (!partido) {
    return (
      <div className="container-page">
        <Card>
          <p className="text-sm text-slate-600">Cargando partido...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page space-y-6">
      <div className="space-y-2">
        {/* ✅ campos correctos */}
        <h2 className="text-2xl font-semibold text-slate-900">
          {partido.equipoA} vs {partido.equipoB}
        </h2>
        <p className="text-sm text-slate-500">Flujo del partido y operaciones admin.</p>
      </div>

      <Stepper
        steps={steps}
        onStepClick={(step) => {
          const element = document.getElementById(step);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      <section id="crear">
        <Card className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Datos del partido</p>
              <p className="text-xs text-slate-500">Estado actual: {partido.estado}</p>
            </div>
            <Badge
              tone={
                partido.estado === 'EN_JUEGO'
                  ? 'info'
                  : partido.estado === 'FINALIZADO'
                  ? 'success'
                  : 'warning'
              }
            >
              {partido.estado}
            </Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-slate-500">Fecha</p>
              {/* ✅ fechaHora */}
              <p className="text-sm font-semibold text-slate-900">
                {formatDateTime(partido.fecha)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Cancha</p>
              <p className="text-sm font-semibold text-slate-900">{partido.cancha}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Equipos</p>
              <p className="text-sm font-semibold text-slate-900">
                {partido.equipoA} / {partido.equipoB}
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section id="jugadores" className="space-y-4">
        <Card className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Paso 2: Seleccionar jugadores</p>
              <p className="text-xs text-slate-500">Buscá y asigná al equipo correspondiente.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedTeam === 'A' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedTeam('A')}
              >
                Equipo A
              </Button>
              <Button
                variant={selectedTeam === 'B' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedTeam('B')}
              >
                Equipo B
              </Button>
            </div>
          </div>

          <Input
            label="Buscar jugador"
            placeholder="Nombre del jugador"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500">Disponibles</p>
              <div className="max-h-[320px] space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {filteredJugadores.map((jugador) => {
                  const isSelected = selectedDraft.some((item) => item.jugadorId === jugador.id);
                  return (
                    <div
                      key={jugador.id}
                      className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{jugador.nombre}</p>
                        <p className="text-xs text-slate-500">
                          {isSelected ? 'Seleccionado' : 'Disponible'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? 'secondary' : 'primary'}
                        disabled={isSelected || !isAdmin}
                        onClick={() => handleAdd(jugador.id)}
                      >
                        {isSelected ? 'Agregado' : 'Agregar'}
                      </Button>
                    </div>
                  );
                })}
                {filteredJugadores.length === 0 && (
                  <p className="text-xs text-slate-500">No hay jugadores con ese nombre.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">Equipo A</p>
                <Badge tone="info">{equipoA.length}</Badge>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                {equipoA.map((item) => (
                  <div
                    key={item.jugadorId}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {jugadoresActivos.find((j) => j.id === item.jugadorId)?.nombre ?? 'Jugador'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!isAdmin}
                      onClick={() => handleRemove(item.jugadorId)}
                    >
                      Quitar
                    </Button>
                  </div>
                ))}
                {equipoA.length === 0 && <p className="text-xs text-slate-500">Sin jugadores asignados.</p>}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">Equipo B</p>
                <Badge tone="info">{equipoB.length}</Badge>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                {equipoB.map((item) => (
                  <div
                    key={item.jugadorId}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {jugadoresActivos.find((j) => j.id === item.jugadorId)?.nombre ?? 'Jugador'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!isAdmin}
                      onClick={() => handleRemove(item.jugadorId)}
                    >
                      Quitar
                    </Button>
                  </div>
                ))}
                {equipoB.length === 0 && <p className="text-xs text-slate-500">Sin jugadores asignados.</p>}
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={confirmSeleccion} disabled={!isAdmin || anotarMutation.isPending}>
            Confirmar selección inicial
          </Button>
        </Card>
      </section>

      <section id="iniciar">
        <Card className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Paso 3: Iniciar partido</p>
              <p className="text-xs text-slate-500">Al iniciar, el flujo pasa a En juego.</p>
            </div>
            <Button
              className="w-full md:w-auto"
              onClick={() => iniciarMutation.mutate()}
              disabled={!isAdmin || partido.estado !== 'PROGRAMADO'}
            >
              Iniciar partido
            </Button>
          </div>
        </Card>
      </section>

      <section id="gestionar">
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Paso 4: Gestionar participaciones</p>
            <p className="text-xs text-slate-500">Bajas, reactivar o mover jugadores entre equipos.</p>
          </div>

          <Tabs
            tabs={[
              { id: 'presentes', label: `Presentes (${presentes.length})` },
              { id: 'bajas', label: `Bajas (${bajas.length})` },
            ]}
            active={tab}
            onChange={setTab}
          />

          <div className="space-y-3">
            {(tab === 'presentes' ? presentes : bajas).map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.jugadorNombre  ?? 'Jugador'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Equipo {item.equipo} · Anotado: {formatDateTime(item.anotado_at)}
                      {item.baja_at && ` · Baja: ${formatDateTime(item.baja_at)}`}
                    </p>
                  </div>

                  {isAdmin && (
                    <div className="flex flex-wrap gap-2">
                      {tab === 'presentes' && (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => handleTeamAction('cambiar', item)}>
                            Cambiar equipo
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => bajaMutation.mutate({ participacionId: item.id })}
                          >
                            Dar baja
                          </Button>
                        </>
                      )}
                      {tab === 'bajas' && (
                        <Button variant="secondary" size="sm" onClick={() => handleTeamAction('reactivar', item)}>
                          Reactivar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(tab === 'presentes' ? presentes : bajas).length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                No hay registros en este estado.
              </div>
            )}
          </div>
        </Card>
      </section>

      <section id="finalizar">
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Paso 5: Finalizar partido</p>
            <p className="text-xs text-slate-500">Elegí ganador y cerrá el partido.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {(['A', 'B', 'EMPATE'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWinner(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  winner === option
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {/* ✅ nombres correctos */}
                {option === 'A' ? partido.equipoA : option === 'B' ? partido.equipoB : 'Empate'}
              </button>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={() => finalizarMutation.mutate({ ganador: winner })}
            disabled={!isAdmin || partido.estado !== 'EN_JUEGO'}
          >
            Finalizar partido
          </Button>
        </Card>
      </section>

      <Modal
        open={teamModal.open}
        title={teamModal.action === 'reactivar' ? 'Reactivar jugador' : 'Cambiar equipo'}
        onClose={() => setTeamModal({ open: false })}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="w-full" onClick={() => submitTeamAction('A')}>
              Equipo A
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => submitTeamAction('B')}>
              Equipo B
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          Seleccioná el equipo destino para {teamModal.participacion?.jugadorNombre ?? 'el jugador'}.
        </p>
      </Modal>
    </div>
  );
};
