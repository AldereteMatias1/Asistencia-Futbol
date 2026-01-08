import { apiFetch } from '../../lib/api';
import { Partido, PartidoDetalle, Participacion } from '../../lib/types';

export const fetchPartidos = (filters?: { estado?: string; desde?: string; hasta?: string }) => {
  const params = new URLSearchParams();
  if (filters?.estado) params.append('estado', filters.estado);
  if (filters?.desde) params.append('desde', filters.desde);
  if (filters?.hasta) params.append('hasta', filters.hasta);
  const query = params.toString();
  return apiFetch<Partido[]>(`/partido${query ? `?${query}` : ''}`);
};

export const fetchPartido = (id: string) => apiFetch<PartidoDetalle>(`/partido/${id}`);

export const createPartido = (payload: {
  fecha: string;
  cancha: string;
  equipoA: string;
  equipoB: string;
}) => apiFetch<Partido>('/partido', { method: 'POST', body: payload, admin: true });

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
