import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DbService } from '../db/db.service';
import { AsistenciaRankingDto } from './dto/asistencia-ranking.dto';
import { BajaRankingDto } from './dto/baja-ranking.dto';
import { GanadoresRankingDto } from './dto/ganadores-ranking.dto';

interface AsistenciaRow extends QueryResultRow {
  id_jugador: number;
  nombre_jugador: string;
  apellido_jugador: string;
  asistencias: number | string;
}

interface BajaRow extends QueryResultRow {
  id_jugador: number;
  nombre_jugador: string;
  apellido_jugador: string;
  bajas: number | string;
}

interface GanadoresRow extends QueryResultRow {
  id_jugador: number;
  nombre_jugador: string;
  apellido_jugador: string;
  partidos_jugados: number | string;
  victorias: number | string;
  winrate: number | string;
}

@Injectable()
export class StatsRepository {
  constructor(private readonly dbService: DbService) {}

  async obtenerRankingAsistencias(limit: number): Promise<AsistenciaRankingDto[]> {
    const query = `
      SELECT
        j.id_jugador,
        j.nombre_jugador,
        j.apellido_jugador,
        COUNT(*) AS asistencias
      FROM mydb.participaciones p
      INNER JOIN mydb.partidos pa ON pa.id_partido = p.partido_id
      INNER JOIN mydb.jugadores j ON j.id_jugador = p.jugador_id
      WHERE p.estado = 'PRESENTE'
        AND pa.estado = 'FINALIZADO'
      GROUP BY j.id_jugador, j.nombre_jugador, j.apellido_jugador
      HAVING COUNT(*) >= 1
      ORDER BY asistencias DESC, j.apellido_jugador ASC, j.nombre_jugador ASC
      LIMIT $1
    `;
    const result = await this.dbService.query<AsistenciaRow>(query, [limit]);
    return result.rows.map((row) => this.mapAsistenciaRow(row));
  }

  async obtenerRankingBajas(limit: number): Promise<BajaRankingDto[]> {
    const query = `
      SELECT
        j.id_jugador,
        j.nombre_jugador,
        j.apellido_jugador,
        COUNT(*) AS bajas
      FROM mydb.participaciones p
      INNER JOIN mydb.partidos pa ON pa.id_partido = p.partido_id
      INNER JOIN mydb.jugadores j ON j.id_jugador = p.jugador_id
      WHERE p.estado = 'BAJA'
      GROUP BY j.id_jugador, j.nombre_jugador, j.apellido_jugador
      HAVING COUNT(*) >= 1
      ORDER BY bajas DESC, j.apellido_jugador ASC, j.nombre_jugador ASC
      LIMIT $1
    `;
    const result = await this.dbService.query<BajaRow>(query, [limit]);
    return result.rows.map((row) => this.mapBajaRow(row));
  }

  async obtenerRankingGanadores(
  limit: number,
  minPartidos: number,
): Promise<GanadoresRankingDto[]> {
  const query = `
    SELECT
      j.id_jugador,
      j.nombre_jugador,
      j.apellido_jugador,
      COUNT(*) AS partidos_jugados,
      COUNT(*) FILTER (
        WHERE p.equipo IS NOT NULL
          AND p.equipo::text = pa.ganador::text
      ) AS victorias,
      ROUND(
        (COUNT(*) FILTER (
          WHERE p.equipo IS NOT NULL
            AND p.equipo::text = pa.ganador::text
        )::numeric / NULLIF(COUNT(*)::numeric, 0)) * 100,
        2
      ) AS winrate
    FROM mydb.participaciones p
    INNER JOIN mydb.partidos pa ON pa.id_partido = p.partido_id
    INNER JOIN mydb.jugadores j ON j.id_jugador = p.jugador_id
    WHERE p.estado = 'PRESENTE'
      AND pa.estado = 'FINALIZADO'
      AND pa.ganador IN ('A', 'B')
    GROUP BY j.id_jugador, j.nombre_jugador, j.apellido_jugador
    HAVING COUNT(*) >= $2
    ORDER BY victorias DESC, winrate DESC, j.apellido_jugador ASC, j.nombre_jugador ASC
    LIMIT $1
  `;
  const result = await this.dbService.query<GanadoresRow>(query, [limit, minPartidos]);
  return result.rows.map((row) => this.mapGanadoresRow(row));
}


  private mapAsistenciaRow(row: AsistenciaRow): AsistenciaRankingDto {
    return {
      jugadorId: row.id_jugador,
      nombre: row.nombre_jugador,
      apellido: row.apellido_jugador,
      asistencias: Number(row.asistencias),
    };
  }

  private mapBajaRow(row: BajaRow): BajaRankingDto {
    return {
      jugadorId: row.id_jugador,
      nombre: row.nombre_jugador,
      apellido: row.apellido_jugador,
      bajas: Number(row.bajas),
    };
  }

  private mapGanadoresRow(row: GanadoresRow): GanadoresRankingDto {
    return {
      jugadorId: row.id_jugador,
      nombre: row.nombre_jugador,
      apellido: row.apellido_jugador,
      partidosJugados: Number(row.partidos_jugados),
      victorias: Number(row.victorias),
      winrate: Number(row.winrate),
    };
  }
}
