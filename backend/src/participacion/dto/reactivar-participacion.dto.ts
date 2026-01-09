import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class ReactivarParticipacionDto {
  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  participacionId: number;

  @ApiPropertyOptional({ enum: ['A', 'B'], example: 'A' })
  @IsOptional()
  @IsIn(['A', 'B'])
  equipo?: 'A' | 'B';

  @ApiPropertyOptional({ example: 'Vuelve a jugar.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentarios?: string;
}
