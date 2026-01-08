import { Body, Controller, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AnotarParticipacionDto } from './dto/anotar-participacion.dto';
import { BajaParticipacionDto } from './dto/baja-participacion.dto';
import { CambiarEquipoDto } from './dto/cambiar-equipo.dto';
import { ParticipacionResponseDto } from './dto/participacion-response.dto';
import { ReactivarParticipacionDto } from './dto/reactivar-participacion.dto';
import { ParticipacionService } from './participacion.service';

@ApiTags('Participaciones')
@Controller('partido')
export class ParticipacionController {
  constructor(private readonly participacionService: ParticipacionService) {}

  @Post(':id/anotar')
  @ApiOperation({ summary: 'Anotar participación en partido' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID del partido' })
  @ApiOkResponse({
    description: 'Participación anotada.',
    type: ParticipacionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Partido o jugador no encontrado.' })
  @ApiConflictResponse({ description: 'Jugador ya anotado en el partido.' })
  anotar(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: AnotarParticipacionDto,
  ) {
    return this.participacionService.anotar(partidoId, dto);
  }

  @Post(':id/baja')
  @ApiOperation({ summary: 'Dar de baja una participación' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID del partido' })
  @ApiOkResponse({
    description: 'Participación dada de baja.',
    type: ParticipacionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Partido o participación no encontrada.' })
  baja(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: BajaParticipacionDto,
  ) {
    return this.participacionService.baja(partidoId, dto);
  }

  @Post(':id/reactivar')
  @ApiOperation({ summary: 'Reactivar una participación' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID del partido' })
  @ApiOkResponse({
    description: 'Participación reactivada.',
    type: ParticipacionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Partido o participación no encontrada.' })
  reactivar(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: ReactivarParticipacionDto,
  ) {
    return this.participacionService.reactivar(partidoId, dto);
  }

  @Patch(':id/cambiar-equipo')
  @ApiOperation({ summary: 'Cambiar equipo de una participación' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID del partido' })
  @ApiOkResponse({
    description: 'Equipo de la participación actualizado.',
    type: ParticipacionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  @ApiNotFoundResponse({ description: 'Partido o participación no encontrada.' })
  cambiarEquipo(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: CambiarEquipoDto,
  ) {
    return this.participacionService.cambiarEquipo(partidoId, dto);
  }
}
