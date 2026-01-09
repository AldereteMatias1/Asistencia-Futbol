import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class FinalizarPartidoDto {
  @ApiProperty({ enum: ['A', 'B', 'EMPATE'], example: 'A' })
  @IsIn(['A', 'B', 'EMPATE'])
  ganador: 'A' | 'B' | 'EMPATE';
}
