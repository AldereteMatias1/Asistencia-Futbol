import { ApiProperty } from '@nestjs/swagger';

export class CambiarEquipoDto {
  @ApiProperty({ example: 10 })
  jugadorId: number;

  @ApiProperty({ enum: ['A', 'B'], example: 'B' })
  equipo: 'A' | 'B';
}
