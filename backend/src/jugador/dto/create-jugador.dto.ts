import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJugadorDto {
  @ApiProperty({ example: 'Lionel' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  nombre: string;

  @ApiProperty({ example: 'Messi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  apellido: string;
}
