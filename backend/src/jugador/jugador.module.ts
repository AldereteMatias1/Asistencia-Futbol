import { Module } from '@nestjs/common';
import { JugadorService } from './jugador.service';
import { JugadorController } from './jugador.controller';

@Module({
  controllers: [JugadorController],
  providers: [JugadorService],
})
export class JugadorModule {}
