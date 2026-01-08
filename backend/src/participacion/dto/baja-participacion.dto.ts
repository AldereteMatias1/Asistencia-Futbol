import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BajaParticipacionDto {
  @ApiProperty({ example: 10 })
  jugadorId: number;

  @ApiPropertyOptional({ example: 'Se retiró por lesión.' })
  comentarios?: string;
}
