import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { JugadorRepository } from '../jugador/jugador.repository';
import { PartidoRepository } from '../partido/partido.repository';
import { AnotarParticipacionDto } from './dto/anotar-participacion.dto';
import { BajaParticipacionDto } from './dto/baja-participacion.dto';
import { CambiarEquipoDto } from './dto/cambiar-equipo.dto';
import { ReactivarParticipacionDto } from './dto/reactivar-participacion.dto';
import { Participacion } from './entities/participacion.entity';
import { ParticipacionRepository } from './participacion.repository';

@Injectable()
export class ParticipacionService {
  constructor(
    private readonly dbService: DbService,
    private readonly participacionRepository: ParticipacionRepository,
    private readonly partidoRepository: PartidoRepository,
    private readonly jugadorRepository: JugadorRepository,
  ) {}

  async anotar(partidoId: number, dto: AnotarParticipacionDto) {
    this.validarEquipo(dto.equipo);

    if (!dto.jugadorId) {
      throw new BadRequestException('jugadorId es obligatorio');
    }

    return this.dbService.withTransaction(async (client) => {
      const partido = await this.partidoRepository.findById(partidoId, client);
      if (!partido) {
        throw new NotFoundException('Partido no encontrado');
      }
      this.validarNoFinalizado(partido);

      const jugador = await this.jugadorRepository.findById(dto.jugadorId, client);
      if (!jugador) {
        throw new NotFoundException('Jugador no encontrado');
      }

      const existente = await this.participacionRepository.findByPartidoYJugador(
        partidoId,
        dto.jugadorId,
        client,
      );
      if (existente) {
        throw new ConflictException('Jugador ya anotado en el partido');
      }

      const participacion = Participacion.crear(
        dto.jugadorId,
        partidoId,
        dto.equipo,
        dto.comentarios,
      );

      const creada = await this.participacionRepository.create(participacion, client);
      return this.toResponse(creada);
    });
  }

  async baja(partidoId: number, dto: BajaParticipacionDto) {
    const participacionId = Number(dto.participacionId);
    if (!participacionId) {
      throw new BadRequestException('participacionId es obligatorio');
    }

    return this.dbService.withTransaction(async (client) => {
      const partido = await this.partidoRepository.findById(Number(partidoId), client);
      if (!partido) throw new NotFoundException('Partido no encontrado');

      this.validarNoFinalizado(partido);

      const participacion = await this.participacionRepository.findById(participacionId, client);
      if (!participacion) throw new NotFoundException('Participacion no encontrada');

      if (Number(participacion.obtenerPartidoId()) !== Number(partidoId)) {
        throw new BadRequestException('La participación no pertenece a este partido');
      }

      participacion.darBaja(dto.comentarios);

      const actualizada = await this.participacionRepository.update(participacion, client);
      return this.toResponse(actualizada);
    });
  }


  async reactivar(partidoId: number, dto: ReactivarParticipacionDto) {
    const participacionId = Number(dto.participacionId);
    if (!participacionId) {
      throw new BadRequestException('participacionId es obligatorio');
    }

    return this.dbService.withTransaction(async (client) => {
      const partido = await this.partidoRepository.findById(Number(partidoId), client);
      if (!partido) throw new NotFoundException('Partido no encontrado');

      this.validarNoFinalizado(partido);

      const participacion = await this.participacionRepository.findById(participacionId, client);
      if (!participacion) throw new NotFoundException('Participacion no encontrada');

      if (Number(participacion.obtenerPartidoId()) !== Number(partidoId)) {
        throw new BadRequestException('La participación no pertenece a este partido');
      }

      participacion.reactivar(dto.comentarios);

      if (dto.equipo) {
        this.validarEquipo(dto.equipo);
        participacion.cambiarEquipo(dto.equipo);
      }

      const actualizada = await this.participacionRepository.update(participacion, client);
      return this.toResponse(actualizada);
    });
  }


  async cambiarEquipo(partidoId: number, dto: CambiarEquipoDto) {
    const participacionId = Number(dto.participacionId);
    if (!participacionId) {
      throw new BadRequestException('participacionId es obligatorio');
    }

    this.validarEquipo(dto.equipo);

    return this.dbService.withTransaction(async (client) => {
      const partido = await this.partidoRepository.findById(Number(partidoId), client);
      if (!partido) throw new NotFoundException('Partido no encontrado');

      this.validarNoFinalizado(partido);

      const participacion = await this.participacionRepository.findById(participacionId, client);
      if (!participacion) throw new NotFoundException('Participacion no encontrada');

      if (Number(participacion.obtenerPartidoId()) !== Number(partidoId)) {
        throw new BadRequestException('La participación no pertenece a este partido');
      }

      participacion.cambiarEquipo(dto.equipo);

      const actualizada = await this.participacionRepository.update(participacion, client);
      return this.toResponse(actualizada);
    });
  }

  private validarEquipo(equipo: 'A' | 'B') {
    if (equipo !== 'A' && equipo !== 'B') {
      throw new BadRequestException('Equipo inválido');
    }
  }

  private validarNoFinalizado(partido: { validarNoFinalizado: () => void }) {
    try {
      partido.validarNoFinalizado();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  private toResponse(participacion: Participacion) {
    return {
      id: participacion.obtenerId(),
      jugadorId: participacion.obtenerJugadorId(),
      partidoId: participacion.obtenerPartidoId(),
      equipo: participacion.obtenerEquipo(),
      estado: participacion.obtenerEstado(),
      anotadoAt: participacion.obtenerAnotadoAt().toISOString(),
      bajaAt: participacion.obtenerBajaAt()
        ? participacion.obtenerBajaAt()!.toISOString()
        : null,
      comentarios: participacion.obtenerComentarios(),
    };
  }
}
