import { BadRequestException, Injectable } from '@nestjs/common';
import { AsistenciaRankingDto } from './dto/asistencia-ranking.dto';
import { BajaRankingDto } from './dto/baja-ranking.dto';
import { GanadoresRankingDto } from './dto/ganadores-ranking.dto';
import { StatsRepository } from './stats.repository';

@Injectable()
export class StatsService {
  private readonly defaultLimit = 100;
  private readonly maxLimit = 500;
  private readonly defaultMinPartidos = 1;

  constructor(private readonly statsRepository: StatsRepository) {}

  obtenerRankingAsistencias(limit?: string): Promise<AsistenciaRankingDto[]> {
    const limite = this.parseLimit(limit);
    return this.statsRepository.obtenerRankingAsistencias(limite);
  }

  obtenerRankingBajas(limit?: string): Promise<BajaRankingDto[]> {
    const limite = this.parseLimit(limit);
    return this.statsRepository.obtenerRankingBajas(limite);
  }

  obtenerRankingGanadores(
    limit?: string,
    minPartidos?: string,
  ): Promise<GanadoresRankingDto[]> {
    const limite = this.parseLimit(limit);
    const min = this.parseMinPartidos(minPartidos);
    return this.statsRepository.obtenerRankingGanadores(limite, min);
  }

  private parseLimit(value?: string): number {
    if (value === undefined) {
      return this.defaultLimit;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('limit debe ser un entero');
    }
    if (parsed < 1 || parsed > this.maxLimit) {
      throw new BadRequestException('limit debe estar entre 1 y 500');
    }
    return parsed;
  }

  private parseMinPartidos(value?: string): number {
    if (value === undefined) {
      return this.defaultMinPartidos;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('minPartidos debe ser un entero');
    }
    if (parsed < 1) {
      throw new BadRequestException('minPartidos debe ser mayor o igual a 1');
    }
    return parsed;
  }
}
