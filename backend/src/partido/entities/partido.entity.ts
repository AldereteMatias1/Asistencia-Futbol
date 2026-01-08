export type EstadoPartido = 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO' | 'CANCELADO';
export type GanadorPartido = 'A' | 'B' | 'EMPATE' | 'PENDIENTE';

export class Partido {
  constructor(
    private readonly id: number | null,
    private fechaHora: Date,
    private cancha: string,
    private estado: EstadoPartido,
    private ganador: GanadorPartido,
    private equipoANombre: string,
    private equipoBNombre: string,
  ) {}

  static crear(
    fechaHora: Date,
    cancha: string,
    equipoANombre: string,
    equipoBNombre: string,
  ): Partido {
    return new Partido(
      null,
      fechaHora,
      cancha,
      'PROGRAMADO',
      'PENDIENTE',
      equipoANombre,
      equipoBNombre,
    );
  }

  actualizarDetalles(
    fechaHora?: Date,
    cancha?: string,
    equipoANombre?: string,
    equipoBNombre?: string,
  ): void {
    this.validarNoFinalizado();
    if (fechaHora !== undefined) {
      this.fechaHora = fechaHora;
    }
    if (cancha !== undefined) {
      this.cancha = cancha;
    }
    if (equipoANombre !== undefined) {
      this.equipoANombre = equipoANombre;
    }
    if (equipoBNombre !== undefined) {
      this.equipoBNombre = equipoBNombre;
    }
  }

  iniciar(): void {
    this.validarNoFinalizado();
    if (this.estado === 'CANCELADO') {
      throw new Error('No se puede iniciar un partido cancelado');
    }
    this.estado = 'EN_JUEGO';
  }

  finalizar(ganador: GanadorPartido): void {
    this.validarNoFinalizado();
    if (this.estado === 'CANCELADO') {
      throw new Error('No se puede finalizar un partido cancelado');
    }
    this.estado = 'FINALIZADO';
    this.ganador = ganador;
  }

  cancelar(): void {
    this.validarNoFinalizado();
    this.estado = 'CANCELADO';
  }

  validarNoFinalizado(): void {
    if (this.estado === 'FINALIZADO') {
      throw new Error('No se puede modificar un partido finalizado');
    }
  }

  obtenerId(): number | null {
    return this.id;
  }

  obtenerFechaHora(): Date {
    return this.fechaHora;
  }

  obtenerCancha(): string {
    return this.cancha;
  }

  obtenerEstado(): EstadoPartido {
    return this.estado;
  }

  obtenerGanador(): GanadorPartido {
    return this.ganador;
  }

  obtenerEquipoANombre(): string {
    return this.equipoANombre;
  }

  obtenerEquipoBNombre(): string {
    return this.equipoBNombre;
  }
}
