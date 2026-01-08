export class Jugador {
  constructor(
    private readonly id: number | null,
    private nombre: string,
    private apellido: string,
    private activo: boolean,
  ) {}

  static crear(nombre: string, apellido: string): Jugador {
    return new Jugador(null, nombre, apellido, true);
  }

  actualizarDatos(nombre?: string, apellido?: string): void {
    if (nombre !== undefined) {
      this.nombre = nombre;
    }
    if (apellido !== undefined) {
      this.apellido = apellido;
    }
  }

  desactivar(): void {
    this.activo = false;
  }

  obtenerId(): number | null {
    return this.id;
  }

  obtenerNombre(): string {
    return this.nombre;
  }

  obtenerApellido(): string {
    return this.apellido;
  }

  estaActivo(): boolean {
    return this.activo;
  }
}
