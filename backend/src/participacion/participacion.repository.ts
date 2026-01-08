import { Injectable } from '@nestjs/common';
import { PoolClient, QueryResultRow } from 'pg';
import { DbService } from '../db/db.service';
import { Participacion } from './entities/participacion.entity';

interface ParticipacionRow extends QueryResultRow {
  id_participacion: number;
  jugador_id: number;
  partido_id: number;
  equipo: 'A' | 'B';
  estado: 'PRESENTE' | 'BAJA';
  anotado_at: Date;
  baja_at: Date | null;
  comentarios: string | null;
}

@Injectable()
export class ParticipacionRepository {
  constructor(private readonly dbService: DbService) {}

  async create(participacion: Participacion, client?: PoolClient): Promise<Participacion> {
    const query =
      'INSERT INTO mydb.participaciones (jugador_id, partido_id, equipo, estado, anotado_at, baja_at, comentarios) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_participacion, jugador_id, partido_id, equipo, estado, anotado_at, baja_at, comentarios';
    const params = [
      participacion.obtenerJugadorId(),
      participacion.obtenerPartidoId(),
      participacion.obtenerEquipo(),
      participacion.obtenerEstado(),
      participacion.obtenerAnotadoAt(),
      participacion.obtenerBajaAt(),
      participacion.obtenerComentarios(),
    ];
    const result = await this.query<ParticipacionRow>(query, params, client);
    return this.mapRow(result.rows[0]);
  }

  async findByPartidoYJugador(
    partidoId: number,
    jugadorId: number,
    client?: PoolClient,
  ): Promise<Participacion | null> {
    const query =
      'SELECT id_participacion, jugador_id, partido_id, equipo, estado, anotado_at, baja_at, comentarios FROM mydb.participaciones WHERE partido_id = $1 AND jugador_id = $2';
    const result = await this.query<ParticipacionRow>(query, [partidoId, jugadorId], client);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRow(result.rows[0]);
  }

  async update(participacion: Participacion, client?: PoolClient): Promise<Participacion> {
    const query =
      'UPDATE mydb.participaciones SET equipo = $1, estado = $2, anotado_at = $3, baja_at = $4, comentarios = $5 WHERE id_participacion = $6 RETURNING id_participacion, jugador_id, partido_id, equipo, estado, anotado_at, baja_at, comentarios';
    const params = [
      participacion.obtenerEquipo(),
      participacion.obtenerEstado(),
      participacion.obtenerAnotadoAt(),
      participacion.obtenerBajaAt(),
      participacion.obtenerComentarios(),
      participacion.obtenerId(),
    ];
    const result = await this.query<ParticipacionRow>(query, params, client);
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: ParticipacionRow): Participacion {
    return new Participacion(
      row.id_participacion,
      row.jugador_id,
      row.partido_id,
      row.equipo,
      row.estado,
      new Date(row.anotado_at),
      row.baja_at ? new Date(row.baja_at) : null,
      row.comentarios,
    );
  }

  private query<T extends QueryResultRow>(
    query: string,
    params: any[],
    client?: PoolClient,
  ) {
    if (client) {
      return client.query<T>(query, params);
    }
    return this.dbService.query<T>(query, params);
  }
}
