import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReactivarParticipacionDto {
  @ApiProperty({ example: 10 })
  jugadorId: number;

  @ApiPropertyOptional({ example: 'Vuelve a jugar.' })
  comentarios?: string;
}
