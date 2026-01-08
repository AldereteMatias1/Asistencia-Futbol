import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnotarParticipacionDto {
  @ApiProperty({ example: 10 })
  jugadorId: number;

  @ApiProperty({ enum: ['A', 'B'], example: 'A' })
  equipo: 'A' | 'B';

  @ApiPropertyOptional({ example: 'Llega 10 minutos tarde.' })
  comentarios?: string;
}
