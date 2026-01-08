import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JugadorService } from './jugador.service';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';

@Controller('jugador')
export class JugadorController {
  constructor(private readonly jugadorService: JugadorService) {}

  @Post()
  create(@Body() createJugadorDto: CreateJugadorDto) {
    return this.jugadorService.create(createJugadorDto);
  }

  @Get()
  findAll() {
    return this.jugadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jugadorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJugadorDto: UpdateJugadorDto) {
    return this.jugadorService.update(+id, updateJugadorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jugadorService.remove(+id);
  }
}
