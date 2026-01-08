import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JugadorModule } from './jugador/jugador.module';
import { PartidoModule } from './partido/partido.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    JugadorModule, 
    PartidoModule, 
    DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
