import { ApiProperty } from '@nestjs/swagger';

export class JugadorResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Lionel' })
  nombre: string;

  @ApiProperty({ example: 'Messi' })
  apellido: string;

  @ApiProperty({ example: true })
  activo: boolean;
}
