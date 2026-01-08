import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AsistenciaRankingDto } from './dto/asistencia-ranking.dto';
import { BajaRankingDto } from './dto/baja-ranking.dto';
import { GanadoresRankingDto } from './dto/ganadores-ranking.dto';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('asistencias')
  @ApiOperation({
    summary: 'Ranking de asistencias',
    description: 'Endpoint público (GET).',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados (1-500).',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Ranking de asistencias.',
    type: [AsistenciaRankingDto],
  })
  obtenerRankingAsistencias(@Query('limit') limit?: string) {
    return this.statsService.obtenerRankingAsistencias(limit);
  }

  @Get('bajas')
  @ApiOperation({
    summary: 'Ranking de bajas',
    description: 'Endpoint público (GET).',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados (1-500).',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Ranking de bajas.',
    type: [BajaRankingDto],
  })
  obtenerRankingBajas(@Query('limit') limit?: string) {
    return this.statsService.obtenerRankingBajas(limit);
  }

  @Get('ganadores')
  @ApiOperation({
    summary: 'Ranking de ganadores',
    description: 'Endpoint público (GET).',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados (1-500).',
    example: 50,
  })
  @ApiQuery({
    name: 'minPartidos',
    required: false,
    description: 'Mínimo de partidos jugados.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ranking de ganadores.',
    type: [GanadoresRankingDto],
  })
  obtenerRankingGanadores(
    @Query('limit') limit?: string,
    @Query('minPartidos') minPartidos?: string,
  ) {
    return this.statsService.obtenerRankingGanadores(limit, minPartidos);
  }
}
