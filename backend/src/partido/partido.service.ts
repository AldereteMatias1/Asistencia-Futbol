import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { FinalizarPartidoDto } from './dto/finalizar-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { GanadorPartido, Partido } from './entities/partido.entity';
import { PartidoRepository } from './partido.repository';
import { ParticipacionRepository } from '../participacion/participacion.repository';

@Injectable()
export class PartidoService {
  constructor(
    private readonly partidoRepository: PartidoRepository,
    private readonly participacionRepository: ParticipacionRepository,
  ) {}

  async create(createPartidoDto: CreatePartidoDto) {
    this.validarTexto(createPartidoDto.cancha, 'cancha');
    this.validarTexto(createPartidoDto.equipoANombre, 'equipoANombre');
    this.validarTexto(createPartidoDto.equipoBNombre, 'equipoBNombre');

    const fechaHora = this.parseFecha(createPartidoDto.fechaHora);

    const partido = Partido.crear(
      fechaHora,
      createPartidoDto.cancha,
      createPartidoDto.equipoANombre,
      createPartidoDto.equipoBNombre,
    );

    const creado = await this.partidoRepository.create(partido);
    return this.toResponse(creado);
  }

  async findAll() {
    const partidos = await this.partidoRepository.findAll();
    return partidos.map((partido) => this.toResponse(partido));
  }

  async findOne(id: number) {
    const partido = await this.partidoRepository.findById(id);
    if (!partido) throw new NotFoundException('Partido no encontrado');

    // ✅ usar detalle con join a jugadores
    const rows = await this.participacionRepository.findDetalleByPartido(id);

    return {
      ...this.toResponse(partido),
      participaciones: rows.map((r: any) => ({
        id: String(r.id_participacion),
        jugadorId: String(r.jugador_id),
        partidoId: String(r.partido_id),
        equipo: r.equipo, // ya viene ::text
        estado: r.estado,
        anotado_at: new Date(r.anotado_at).toISOString(),
        baja_at: r.baja_at ? new Date(r.baja_at).toISOString() : null,
        comentarios: r.comentarios ?? null,

        // ✅ esto es lo que te falta para que se vea el nombre
        jugadorNombre: `${r.nombre_jugador} ${r.apellido_jugador}`,

        // ✅ tu front usa activo para filtrar presentes/bajas
        activo: r.estado === 'PRESENTE',
      })),
    };
  }


  async update(id: number, updatePartidoDto: UpdatePartidoDto) {
    const partido = await this.partidoRepository.findById(id);
    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }

    if (
      updatePartidoDto.fechaHora === undefined &&
      updatePartidoDto.cancha === undefined &&
      updatePartidoDto.equipoANombre === undefined &&
      updatePartidoDto.equipoBNombre === undefined
    ) {
      throw new BadRequestException('No hay datos para actualizar');
    }

    if (updatePartidoDto.cancha !== undefined) {
      this.validarTexto(updatePartidoDto.cancha, 'cancha');
    }
    if (updatePartidoDto.equipoANombre !== undefined) {
      this.validarTexto(updatePartidoDto.equipoANombre, 'equipoANombre');
    }
    if (updatePartidoDto.equipoBNombre !== undefined) {
      this.validarTexto(updatePartidoDto.equipoBNombre, 'equipoBNombre');
    }

    const fechaHora = updatePartidoDto.fechaHora
      ? this.parseFecha(updatePartidoDto.fechaHora)
      : undefined;

    try {
      partido.actualizarDetalles(
        fechaHora,
        updatePartidoDto.cancha,
        updatePartidoDto.equipoANombre,
        updatePartidoDto.equipoBNombre,
      );
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const actualizado = await this.partidoRepository.update(partido);
    return this.toResponse(actualizado);
  }

  async iniciar(id: number) {
    const partido = await this.partidoRepository.findById(id);
    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }
    try {
      partido.iniciar();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
    const actualizado = await this.partidoRepository.update(partido);
    return this.toResponse(actualizado);
  }

  async finalizar(id: number, finalizarPartidoDto: FinalizarPartidoDto) {
    const partido = await this.partidoRepository.findById(id);
    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }

    const ganador = this.validarGanador(finalizarPartidoDto.ganador);

    try {
      partido.finalizar(ganador);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const actualizado = await this.partidoRepository.update(partido);
    return this.toResponse(actualizado);
  }

  async cancelar(id: number) {
    const partido = await this.partidoRepository.findById(id);
    if (!partido) {
      throw new NotFoundException('Partido no encontrado');
    }
    try {
      partido.cancelar();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
    const actualizado = await this.partidoRepository.update(partido);
    return this.toResponse(actualizado);
  }

  private parseFecha(valor: string): Date {
    if (!valor) {
      throw new BadRequestException('fechaHora es obligatoria');
    }
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException('fechaHora inválida');
    }
    return fecha;
  }

  private validarTexto(valor: string, campo: string): void {
    if (!valor || valor.trim().length === 0) {
      throw new BadRequestException(`El campo ${campo} es obligatorio`);
    }
  }

  private validarGanador(valor: GanadorPartido): GanadorPartido {
    const permitidos: GanadorPartido[] = ['A', 'B', 'EMPATE'];
    if (!valor || !permitidos.includes(valor)) {
      throw new BadRequestException('Ganador inválido');
    }
    return valor;
  }

  private toResponse(partido: Partido) {
    return {
      id: partido.obtenerId(),
      fechaHora: partido.obtenerFechaHora().toISOString(),
      cancha: partido.obtenerCancha(),
      estado: partido.obtenerEstado(),
      ganador: partido.obtenerGanador(),
      equipoANombre: partido.obtenerEquipoANombre(),
      equipoBNombre: partido.obtenerEquipoBNombre(),
    };
  }

  // ✅ Respuesta para detalle con participaciones
  private toDetalleResponse(partido: Partido, participaciones: any[]) {
    return {
      ...this.toResponse(partido),
      participaciones: participaciones.map((p: any) => ({
        id: String(p.obtenerId?.() ?? p.id),
        jugadorId: String(p.obtenerJugadorId?.() ?? p.jugadorId),
        partidoId: String(p.obtenerPartidoId?.() ?? p.partidoId),
        equipo: p.obtenerEquipo?.() ?? p.equipo,
        estado: p.obtenerEstado?.() ?? p.estado,
        anotado_at: (p.obtenerAnotadoAt?.() ?? p.anotadoAt)?.toISOString?.() ?? p.anotado_at,
        baja_at: (p.obtenerBajaAt?.() ?? p.bajaAt)?.toISOString?.() ?? p.baja_at ?? null,
        activo: (p.obtenerEstado?.() ?? p.estado) === 'PRESENTE',
      })),
    };
  }
}
