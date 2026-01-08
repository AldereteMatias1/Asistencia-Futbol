import { ApiProperty } from '@nestjs/swagger';

export class ParticipacionResponseDto {
  @ApiProperty({ example: 20 })
  id: number;

  @ApiProperty({ example: 10 })
  jugadorId: number;

  @ApiProperty({ example: 5 })
  partidoId: number;

  @ApiProperty({ enum: ['A', 'B'], example: 'A' })
  equipo: 'A' | 'B';

  @ApiProperty({ enum: ['PRESENTE', 'BAJA'], example: 'PRESENTE' })
  estado: 'PRESENTE' | 'BAJA';

  @ApiProperty({ example: '2025-01-15T20:10:00.000Z', format: 'date-time' })
  anotadoAt: string;

  @ApiProperty({
    example: '2025-01-15T21:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  bajaAt: string | null;

  @ApiProperty({ example: 'Llega 10 minutos tarde.', nullable: true })
  comentarios: string | null;
}
