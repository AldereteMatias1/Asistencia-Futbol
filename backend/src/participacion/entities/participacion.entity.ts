export type EquipoParticipacion = 'A' | 'B';
export type EstadoParticipacion = 'PRESENTE' | 'BAJA';

export class Participacion {
  constructor(
    private readonly id: number | null,
    private readonly jugadorId: number,
    private readonly partidoId: number,
    private equipo: EquipoParticipacion,
    private estado: EstadoParticipacion,
    private anotadoAt: Date,
    private bajaAt: Date | null,
    private comentarios: string | null,
  ) {}

  static crear(
    jugadorId: number,
    partidoId: number,
    equipo: EquipoParticipacion,
    comentarios?: string | null,
  ): Participacion {
    return new Participacion(
      null,
      jugadorId,
      partidoId,
      equipo,
      'PRESENTE',
      new Date(),
      null,
      comentarios ?? null,
    );
  }

  darBaja(comentarios?: string | null): void {
    this.estado = 'BAJA';
    this.bajaAt = new Date();
    if (comentarios !== undefined) {
      this.comentarios = comentarios ?? null;
    }
  }

  reactivar(comentarios?: string | null): void {
    this.estado = 'PRESENTE';
    this.bajaAt = null;
    if (comentarios !== undefined) {
      this.comentarios = comentarios ?? null;
    }
  }

  cambiarEquipo(equipo: EquipoParticipacion): void {
    this.equipo = equipo;
  }

  obtenerId(): number | null {
    return this.id;
  }

  obtenerJugadorId(): number {
    return this.jugadorId;
  }

  obtenerPartidoId(): number {
    return this.partidoId;
  }

  obtenerEquipo(): EquipoParticipacion {
    return this.equipo;
  }

  obtenerEstado(): EstadoParticipacion {
    return this.estado;
  }

  obtenerAnotadoAt(): Date {
    return this.anotadoAt;
  }

  obtenerBajaAt(): Date | null {
    return this.bajaAt;
  }

  obtenerComentarios(): string | null {
    return this.comentarios;
  }
}
