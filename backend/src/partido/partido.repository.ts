import { Injectable } from '@nestjs/common';
import { PoolClient, QueryResultRow } from 'pg';
import { DbService } from '../db/db.service';
import { GanadorPartido, Partido } from './entities/partido.entity';

interface PartidoRow extends QueryResultRow {
  id_partido: number;
  fecha_hora: Date;
  cancha: string;
  estado: 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO' | 'CANCELADO';
  ganador: GanadorPartido;
  equipo_a_nombre: string;
  equipo_b_nombre: string;
}

@Injectable()
export class PartidoRepository {
  constructor(private readonly dbService: DbService) {}

  async create(partido: Partido): Promise<Partido> {
    const query =
      'INSERT INTO mydb.partidos (fecha_hora, cancha, estado, ganador, equipo_a_nombre, equipo_b_nombre) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_partido, fecha_hora, cancha, estado, ganador, equipo_a_nombre, equipo_b_nombre';
    const params = [
      partido.obtenerFechaHora(),
      partido.obtenerCancha(),
      partido.obtenerEstado(),
      partido.obtenerGanador(),
      partido.obtenerEquipoANombre(),
      partido.obtenerEquipoBNombre(),
    ];
    const result = await this.dbService.query<PartidoRow>(query, params);
    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<Partido[]> {
    const query =
      'SELECT id_partido, fecha_hora, cancha, estado, ganador, equipo_a_nombre, equipo_b_nombre FROM mydb.partidos ORDER BY id_partido';
    const result = await this.dbService.query<PartidoRow>(query);
    return result.rows.map((row) => this.mapRow(row));
  }

  async findById(id: number, client?: PoolClient): Promise<Partido | null> {
    const query =
      'SELECT id_partido, fecha_hora, cancha, estado, ganador, equipo_a_nombre, equipo_b_nombre FROM mydb.partidos WHERE id_partido = $1';
    const result = await this.query<PartidoRow>(query, [id], client);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRow(result.rows[0]);
  }

  async update(partido: Partido, client?: PoolClient): Promise<Partido> {
    const query =
      'UPDATE mydb.partidos SET fecha_hora = $1, cancha = $2, estado = $3, ganador = $4, equipo_a_nombre = $5, equipo_b_nombre = $6 WHERE id_partido = $7 RETURNING id_partido, fecha_hora, cancha, estado, ganador, equipo_a_nombre, equipo_b_nombre';
    const params = [
      partido.obtenerFechaHora(),
      partido.obtenerCancha(),
      partido.obtenerEstado(),
      partido.obtenerGanador(),
      partido.obtenerEquipoANombre(),
      partido.obtenerEquipoBNombre(),
      partido.obtenerId(),
    ];
    const result = await this.query<PartidoRow>(query, params, client);
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: PartidoRow): Partido {
    return new Partido(
      row.id_partido,
      new Date(row.fecha_hora),
      row.cancha,
      row.estado,
      row.ganador,
      row.equipo_a_nombre,
      row.equipo_b_nombre,
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
