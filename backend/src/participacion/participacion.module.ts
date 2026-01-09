import { Module, forwardRef } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { PartidoModule } from '../partido/partido.module';
import { JugadorModule } from '../jugador/jugador.module';

import { ParticipacionController } from './participacion.controller';
import { ParticipacionService } from './participacion.service';
import { ParticipacionRepository } from './participacion.repository';

@Module({
  imports: [
    DbModule,
    forwardRef(() => PartidoModule),
    forwardRef(() => JugadorModule),
  ],
  controllers: [ParticipacionController],
  providers: [ParticipacionService, ParticipacionRepository],
  exports: [ParticipacionRepository], // ✅ ESTO ES LO CLAVE
})
export class ParticipacionModule {}
