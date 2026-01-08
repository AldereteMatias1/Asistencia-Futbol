import { Injectable } from '@nestjs/common';
import { PoolClient, QueryResultRow } from 'pg';
import { DbService } from '../db/db.service';
import { Jugador } from './entities/jugador.entity';

interface JugadorRow extends QueryResultRow {
  id_jugador: number;
  nombre_jugador: string;
  apellido_jugador: string;
  activo: boolean;
}

@Injectable()
export class JugadorRepository {
  constructor(private readonly dbService: DbService) {}

  async create(jugador: Jugador, client?: PoolClient): Promise<Jugador> {
    const query =
      'INSERT INTO mydb.jugadores (nombre_jugador, apellido_jugador, activo) VALUES ($1, $2, $3) RETURNING id_jugador, nombre_jugador, apellido_jugador, activo';
    const params = [
      jugador.obtenerNombre(),
      jugador.obtenerApellido(),
      jugador.estaActivo(),
    ];
    const result = await this.query<JugadorRow>(query, params, client);
    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<Jugador[]> {
    const query =
      'SELECT id_jugador, nombre_jugador, apellido_jugador, activo FROM mydb.jugadores ORDER BY id_jugador';
    const result = await this.dbService.query<JugadorRow>(query);
    return result.rows.map((row) => this.mapRow(row));
  }

  async findById(id: number, client?: PoolClient): Promise<Jugador | null> {
    const query =
      'SELECT id_jugador, nombre_jugador, apellido_jugador, activo FROM mydb.jugadores WHERE id_jugador = $1';
    const result = await this.query<JugadorRow>(query, [id], client);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRow(result.rows[0]);
  }

  async update(jugador: Jugador, client?: PoolClient): Promise<Jugador> {
    const query =
      'UPDATE mydb.jugadores SET nombre_jugador = $1, apellido_jugador = $2, activo = $3 WHERE id_jugador = $4 RETURNING id_jugador, nombre_jugador, apellido_jugador, activo';
    const params = [
      jugador.obtenerNombre(),
      jugador.obtenerApellido(),
      jugador.estaActivo(),
      jugador.obtenerId(),
    ];
    const result = await this.query<JugadorRow>(query, params, client);
    return this.mapRow(result.rows[0]);
  }

  async deactivate(id: number, client?: PoolClient): Promise<Jugador | null> {
    const query =
      'UPDATE mydb.jugadores SET activo = false WHERE id_jugador = $1 RETURNING id_jugador, nombre_jugador, apellido_jugador, activo';
    const result = await this.query<JugadorRow>(query, [id], client);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: JugadorRow): Jugador {
    return new Jugador(
      row.id_jugador,
      row.nombre_jugador,
      row.apellido_jugador,
      row.activo,
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
