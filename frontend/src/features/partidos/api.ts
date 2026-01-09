import { apiFetch } from '../../lib/api';
import { Partido, PartidoDetalle, Participacion } from '../../lib/types';

// Respuesta real del backend (según tu PartidoService)
type PartidoApi = {
  id: number | string;
  fechaHora: string;
  cancha: string;
  estado: 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO' | 'CANCELADO';
  ganador: 'A' | 'B' | 'EMPATE' | 'PENDIENTE' | null;
  equipoANombre: string;
  equipoBNombre: string;
  participaciones?: any[];
};

const mapPartido = (p: PartidoApi): Partido => ({
  id: String(p.id),
  fecha: p.fechaHora,            // 👈 mapeo
  cancha: p.cancha,
  equipoA: p.equipoANombre,      // 👈 mapeo
  equipoB: p.equipoBNombre,      // 👈 mapeo
  estado: p.estado,
});

const mapParticipacion = (x: any): Participacion => ({
  id: String(x.id),
  jugadorId: String(x.jugadorId),
  jugadorNombre:
    x.jugadorNombre ??
    `${x.nombre ?? ''} ${x.apellido ?? ''}`.trim() ??
    'Jugador',
  equipo: x.equipo,
  anotado_at: x.anotado_at ?? x.anotadoAt ?? undefined,
  baja_at: x.baja_at ?? x.bajaAt ?? null,
  activo: Boolean(x.activo ?? (x.estado === 'PRESENTE')),
});

const mapPartidoDetalle = (p: PartidoApi): PartidoDetalle => ({
  ...mapPartido(p),
  ganador: p.ganador === 'PENDIENTE' ? null : (p.ganador as any),
  participaciones: (p.participaciones ?? []).map(mapParticipacion),
});

export const fetchPartidos = async (filters?: { estado?: string; desde?: string; hasta?: string }) => {
  const params = new URLSearchParams();
  if (filters?.estado) params.append('estado', filters.estado);
  if (filters?.desde) params.append('desde', filters.desde);
  if (filters?.hasta) params.append('hasta', filters.hasta);

  const query = params.toString();
  const data = await apiFetch<PartidoApi[]>(`/partido${query ? `?${query}` : ''}`);
  return data.map(mapPartido);
};

export const fetchPartido = async (id: string) => {
  const data = await apiFetch<PartidoApi>(`/partido/${id}`);
  return mapPartidoDetalle(data);
};

export const createPartido = async (payload: {
  fecha: string;
  cancha: string;
  equipoA: string;
  equipoB: string;
}) => {
  // Backend espera fechaHora + equipoANombre/equipoBNombre
  const body = {
    fechaHora: payload.fecha,
    cancha: payload.cancha,
    equipoANombre: payload.equipoA,
    equipoBNombre: payload.equipoB,
  };

  const data = await apiFetch<PartidoApi>('/partido', { method: 'POST', body, admin: true });
  return mapPartido(data);
};

export const iniciarPartido = (id: string) =>
  apiFetch<void>(`/partido/${id}/iniciar`, { method: 'POST', admin: true });

export const finalizarPartido = (id: string, payload: { ganador: 'A' | 'B' | 'EMPATE' }) =>
  apiFetch<void>(`/partido/${id}/finalizar`, { method: 'POST', body: payload, admin: true });

export const anotarJugador = (id: string, payload: { jugadorId: string; equipo: 'A' | 'B' }) =>
  apiFetch<Participacion>(`/partido/${id}/anotar`, { method: 'POST', body: payload, admin: true });

export const bajaJugador = (id: string, payload: { participacionId: string }) =>
  apiFetch<void>(`/partido/${id}/baja`, { method: 'POST', body: payload, admin: true });

export const reactivarJugador = (id: string, payload: { participacionId: string; equipo?: 'A' | 'B' }) =>
  apiFetch<void>(`/partido/${id}/reactivar`, { method: 'POST', body: payload, admin: true });

export const cambiarEquipo = (id: string, payload: { participacionId: string; equipo: 'A' | 'B' }) =>
  apiFetch<void>(`/partido/${id}/cambiar-equipo`, { method: 'PATCH', body: payload, admin: true });
