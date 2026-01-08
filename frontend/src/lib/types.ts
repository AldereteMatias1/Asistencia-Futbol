export type PartidoEstado = 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO' | 'CANCELADO';

export type Jugador = {
  id: string;
  nombre: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Partido = {
  id: string;
  fecha: string;
  cancha: string;
  equipoA: string;
  equipoB: string;
  estado: PartidoEstado;
  createdAt?: string;
};

export type Participacion = {
  id: string;
  jugadorId: string;
  jugadorNombre: string;
  equipo: 'A' | 'B';
  anotado_at?: string;
  baja_at?: string | null;
  activo: boolean;
};

export type PartidoDetalle = Partido & {
  participaciones: Participacion[];
  ganador?: 'A' | 'B' | 'EMPATE' | null;
};

export type StatAsistencia = {
  jugadorId: string;
  jugadorNombre: string;
  total: number;
};

export type StatBaja = {
  jugadorId: string;
  jugadorNombre: string;
  total: number;
};

export type StatGanador = {
  equipo: string;
  total: number;
};
