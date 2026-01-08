import { ApiProperty } from '@nestjs/swagger';

export class AsistenciaRankingDto {
  @ApiProperty({ example: 1 })
  jugadorId: number;

  @ApiProperty({ example: 'Lionel' })
  nombre: string;

  @ApiProperty({ example: 'Messi' })
  apellido: string;

  @ApiProperty({ example: 12 })
  asistencias: number;
}
