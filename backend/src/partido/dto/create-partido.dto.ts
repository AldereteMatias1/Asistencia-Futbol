import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePartidoDto {
  @ApiProperty({ example: '2025-01-15T20:00:00.000Z', format: 'date-time' })
  @IsISO8601()
  fechaHora: string;

  @ApiProperty({ example: 'Cancha 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  cancha: string;

  @ApiProperty({ example: 'Equipo A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  equipoANombre: string;

  @ApiProperty({ example: 'Equipo B' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  equipoBNombre: string;
}
