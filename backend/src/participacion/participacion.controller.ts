import { Body, Controller, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { AnotarParticipacionDto } from './dto/anotar-participacion.dto';
import { BajaParticipacionDto } from './dto/baja-participacion.dto';
import { CambiarEquipoDto } from './dto/cambiar-equipo.dto';
import { ReactivarParticipacionDto } from './dto/reactivar-participacion.dto';
import { ParticipacionService } from './participacion.service';

@Controller('partido')
export class ParticipacionController {
  constructor(private readonly participacionService: ParticipacionService) {}

  @Post(':id/anotar')
  anotar(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: AnotarParticipacionDto,
  ) {
    return this.participacionService.anotar(partidoId, dto);
  }

  @Post(':id/baja')
  baja(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: BajaParticipacionDto,
  ) {
    return this.participacionService.baja(partidoId, dto);
  }

  @Post(':id/reactivar')
  reactivar(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: ReactivarParticipacionDto,
  ) {
    return this.participacionService.reactivar(partidoId, dto);
  }

  @Patch(':id/cambiar-equipo')
  cambiarEquipo(
    @Param('id', ParseIntPipe) partidoId: number,
    @Body() dto: CambiarEquipoDto,
  ) {
    return this.participacionService.cambiarEquipo(partidoId, dto);
  }
}
