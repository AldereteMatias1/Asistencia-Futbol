import { apiFetch } from '../../lib/api';
import { StatAsistencia, StatBaja, StatGanador } from '../../lib/types';

export const fetchAsistencias = (params?: { limit?: number }) => {
  const query = params?.limit ? `?limit=${params.limit}` : '';
  return apiFetch<StatAsistencia[]>(`/stats/asistencias${query}`);
};

export const fetchBajas = (params?: { limit?: number }) => {
  const query = params?.limit ? `?limit=${params.limit}` : '';
  return apiFetch<StatBaja[]>(`/stats/bajas${query}`);
};

export const fetchGanadores = (params: { minPartidos: number; limit: number }) => {
  const query = new URLSearchParams({
    minPartidos: String(params.minPartidos),
    limit: String(params.limit),
  }).toString();

  return apiFetch<StatGanador[]>(`/stats/ganadores?${query}`);
};
