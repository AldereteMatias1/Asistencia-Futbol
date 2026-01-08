import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { PartidoController } from './partido.controller';
import { PartidoRepository } from './partido.repository';
import { PartidoService } from './partido.service';

@Module({
  imports: [DbModule],
  controllers: [PartidoController],
  providers: [PartidoService, PartidoRepository],
  exports: [PartidoService, PartidoRepository],
})
export class PartidoModule {}
