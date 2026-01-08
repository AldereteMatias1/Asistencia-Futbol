import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { JugadorModule } from './jugador/jugador.module';
import { PartidoModule } from './partido/partido.module';
import { ParticipacionModule } from './participacion/participacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JugadorModule,
    PartidoModule,
    ParticipacionModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
