import { apiFetch } from '../../lib/api';
import { Jugador } from '../../lib/types';

export const fetchJugadores = () => apiFetch<Jugador[]>('/jugador');

export const createJugador = (payload: { nombre: string }) =>
  apiFetch<Jugador>('/jugador', { method: 'POST', body: payload, admin: true });

export const updateJugador = (id: string, payload: { nombre: string }) =>
  apiFetch<Jugador>(`/jugador/${id}`, { method: 'PATCH', body: payload, admin: true });

export const deactivateJugador = (id: string) =>
  apiFetch<void>(`/jugador/${id}`, { method: 'DELETE', admin: true });
