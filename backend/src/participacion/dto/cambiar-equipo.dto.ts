import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsPositive } from 'class-validator';

export class CambiarEquipoDto {
  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  participacionId: number;

  @ApiProperty({ enum: ['A', 'B'], example: 'B' })
  @IsIn(['A', 'B'])
  equipo: 'A' | 'B';
}
