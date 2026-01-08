import { ApiProperty } from '@nestjs/swagger';

export class CreatePartidoDto {
  @ApiProperty({ example: '2025-01-15T20:00:00.000Z', format: 'date-time' })
  fechaHora: string;

  @ApiProperty({ example: 'Cancha 1' })
  cancha: string;

  @ApiProperty({ example: 'Equipo A' })
  equipoANombre: string;

  @ApiProperty({ example: 'Equipo B' })
  equipoBNombre: string;
}
