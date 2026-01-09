import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class AnotarParticipacionDto {
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  jugadorId: number;

  @ApiProperty({ enum: ['A', 'B'], example: 'A' })
  @IsIn(['A', 'B'])
  equipo: 'A' | 'B';

  @ApiPropertyOptional({ example: 'Llega 10 minutos tarde.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  comentarios?: string;
}
