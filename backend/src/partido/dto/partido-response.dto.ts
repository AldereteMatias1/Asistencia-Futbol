import { ApiProperty } from '@nestjs/swagger';

export class PartidoResponseDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: '2025-01-15T20:00:00.000Z', format: 'date-time' })
  fechaHora: string;

  @ApiProperty({ example: 'Cancha 1' })
  cancha: string;

  @ApiProperty({
    enum: ['PROGRAMADO', 'EN_JUEGO', 'FINALIZADO', 'CANCELADO'],
    example: 'PROGRAMADO',
  })
  estado: 'PROGRAMADO' | 'EN_JUEGO' | 'FINALIZADO' | 'CANCELADO';

  @ApiProperty({ enum: ['A', 'B', 'EMPATE', 'PENDIENTE'], example: 'PENDIENTE' })
  ganador: 'A' | 'B' | 'EMPATE' | 'PENDIENTE';

  @ApiProperty({ example: 'Equipo A' })
  equipoANombre: string;

  @ApiProperty({ example: 'Equipo B' })
  equipoBNombre: string;
}
