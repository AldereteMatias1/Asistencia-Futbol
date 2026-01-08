import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { JugadorModule } from '../jugador/jugador.module';
import { PartidoModule } from '../partido/partido.module';
import { ParticipacionController } from './participacion.controller';
import { ParticipacionRepository } from './participacion.repository';
import { ParticipacionService } from './participacion.service';

@Module({
  imports: [DbModule, PartidoModule, JugadorModule],
  controllers: [ParticipacionController],
  providers: [ParticipacionService, ParticipacionRepository],
})
export class ParticipacionModule {}
