import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJugadorDto } from './dto/create-jugador.dto';
import { JugadorResponseDto } from './dto/jugador-response.dto';
import { UpdateJugadorDto } from './dto/update-jugador.dto';
import { JugadorService } from './jugador.service';

@ApiTags('Jugadores')
@Controller('jugador')
export class JugadorController {
  constructor(private readonly jugadorService: JugadorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear jugador' })
  @ApiCreatedResponse({ description: 'Jugador creado.', type: JugadorResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  create(@Body() createJugadorDto: CreateJugadorDto) {
    return this.jugadorService.create(createJugadorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar jugadores' })
  @ApiOkResponse({ description: 'Listado de jugadores.', type: [JugadorResponseDto] })
  findAll() {
    return this.jugadorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener jugador por id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Jugador encontrado.', type: JugadorResponseDto })
  @ApiNotFoundResponse({ description: 'Jugador no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jugadorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar jugador' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Jugador actualizado.', type: JugadorResponseDto })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Jugador no encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJugadorDto: UpdateJugadorDto,
  ) {
    return this.jugadorService.update(id, updateJugadorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar jugador' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ description: 'Jugador desactivado.', type: JugadorResponseDto })
  @ApiNotFoundResponse({ description: 'Jugador no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jugadorService.remove(id);
  }
}
