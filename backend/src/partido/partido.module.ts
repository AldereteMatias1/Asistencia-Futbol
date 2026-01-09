import { Module, forwardRef } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ParticipacionModule } from '../participacion/participacion.module';

import { PartidoController } from './partido.controller';
import { PartidoService } from './partido.service';
import { PartidoRepository } from './partido.repository';

@Module({
  imports: [
    DbModule,
    forwardRef(() => ParticipacionModule), // ✅ IMPORTANTE
  ],
  controllers: [PartidoController],
  providers: [PartidoService, PartidoRepository],
  exports: [PartidoRepository], // opcional, pero recomendable
})
export class PartidoModule {}
