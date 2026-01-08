import { ApiProperty } from '@nestjs/swagger';

export class GanadoresRankingDto {
  @ApiProperty({ example: 1 })
  jugadorId: number;

  @ApiProperty({ example: 'Lionel' })
  nombre: string;

  @ApiProperty({ example: 'Messi' })
  apellido: string;

  @ApiProperty({ example: 20 })
  partidosJugados: number;

  @ApiProperty({ example: 9 })
  victorias: number;

  @ApiProperty({ example: 45.0 })
  winrate: number;
}
