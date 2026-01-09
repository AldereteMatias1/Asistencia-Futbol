import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsOptional, IsString, MaxLength } from 'class-validator';

export class BajaParticipacionDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  participacionId: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentarios?: string;
}
