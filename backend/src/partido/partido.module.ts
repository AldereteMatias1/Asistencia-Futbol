import { Module } from '@nestjs/common';
import { PartidoService } from './partido.service';
import { PartidoController } from './partido.controller';

@Module({
  controllers: [PartidoController],
  providers: [PartidoService],
})
export class PartidoModule {}
