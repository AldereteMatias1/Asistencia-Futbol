import { ApiProperty } from '@nestjs/swagger';

export class FinalizarPartidoDto {
  @ApiProperty({ enum: ['A', 'B', 'EMPATE'], example: 'A' })
  ganador: 'A' | 'B' | 'EMPATE';
}
