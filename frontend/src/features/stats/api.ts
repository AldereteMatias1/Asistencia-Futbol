import { apiFetch } from '../../lib/api';
import { StatAsistencia, StatBaja, StatGanador } from '../../lib/types';

export const fetchAsistencias = () => apiFetch<StatAsistencia[]>('/stats/asistencias');
export const fetchBajas = () => apiFetch<StatBaja[]>('/stats/bajas');
export const fetchGanadores = (params: { minPartidos: number; limit: number }) => {
  const query = new URLSearchParams({
    minPartidos: String(params.minPartidos),
    limit: String(params.limit),
  }).toString();
  return apiFetch<StatGanador[]>(`/stats/ganadores?${query}`);
};
