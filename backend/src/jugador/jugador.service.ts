import { Injectable } from '@nestjs/common';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';

@Injectable()
export class JugadorService {
  create(createJugadorDto: CreateJugadorDto) {
    return 'This action adds a new jugador';
  }

  findAll() {
    return `This action returns all jugador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jugador`;
  }

  update(id: number, updateJugadorDto: UpdateJugadorDto) {
    return `This action updates a #${id} jugador`;
  }

  remove(id: number) {
    return `This action removes a #${id} jugador`;
  }
}
