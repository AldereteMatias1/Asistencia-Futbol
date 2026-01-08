import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { Jugador } from './entities/jugador.entity';
import { JugadorRepository } from './jugador.repository';

@Injectable()
export class JugadorService {
  constructor(private readonly jugadorRepository: JugadorRepository) {}

  async create(createJugadorDto: CreateJugadorDto) {
    this.validarTexto(createJugadorDto.nombre, 'nombre');
    this.validarTexto(createJugadorDto.apellido, 'apellido');
    const jugador = Jugador.crear(
      createJugadorDto.nombre,
      createJugadorDto.apellido,
    );
    const creado = await this.jugadorRepository.create(jugador);
    return this.toResponse(creado);
  }

  async findAll() {
    const jugadores = await this.jugadorRepository.findAll();
    return jugadores.map((jugador) => this.toResponse(jugador));
  }

  async findOne(id: number) {
    const jugador = await this.jugadorRepository.findById(id);
    if (!jugador) {
      throw new NotFoundException('Jugador no encontrado');
    }
    return this.toResponse(jugador);
  }

  async update(id: number, updateJugadorDto: UpdateJugadorDto) {
    const jugador = await this.jugadorRepository.findById(id);
    if (!jugador) {
      throw new NotFoundException('Jugador no encontrado');
    }
    if (
      updateJugadorDto.nombre === undefined &&
      updateJugadorDto.apellido === undefined
    ) {
      throw new BadRequestException('No hay datos para actualizar');
    }
    if (updateJugadorDto.nombre !== undefined) {
      this.validarTexto(updateJugadorDto.nombre, 'nombre');
    }
    if (updateJugadorDto.apellido !== undefined) {
      this.validarTexto(updateJugadorDto.apellido, 'apellido');
    }
    jugador.actualizarDatos(
      updateJugadorDto.nombre,
      updateJugadorDto.apellido,
    );
    const actualizado = await this.jugadorRepository.update(jugador);
    return this.toResponse(actualizado);
  }

  async remove(id: number) {
    const jugador = await this.jugadorRepository.deactivate(id);
    if (!jugador) {
      throw new NotFoundException('Jugador no encontrado');
    }
    return this.toResponse(jugador);
  }

  private validarTexto(valor: string, campo: string): void {
    if (!valor || valor.trim().length === 0) {
      throw new BadRequestException(`El campo ${campo} es obligatorio`);
    }
  }

  private toResponse(jugador: Jugador) {
    return {
      id: jugador.obtenerId(),
      nombre: jugador.obtenerNombre(),
      apellido: jugador.obtenerApellido(),
      activo: jugador.estaActivo(),
    };
  }
}
