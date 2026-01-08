import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { JugadorController } from './jugador.controller';
import { JugadorRepository } from './jugador.repository';
import { JugadorService } from './jugador.service';

@Module({
  imports: [DbModule],
  controllers: [JugadorController],
  providers: [JugadorService, JugadorRepository],
  exports: [JugadorService, JugadorRepository],
})
export class JugadorModule {}
