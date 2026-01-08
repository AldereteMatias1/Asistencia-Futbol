import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AdminWriteGuard } from './guards/admin-write.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  app.useGlobalGuards(new AdminWriteGuard(app.get(ConfigService)));

  const config = new DocumentBuilder()
    .setTitle('Asistencia Fútbol API')
    .setDescription(
      'Documentación de la API para jugadores, partidos y participaciones. ' +
        'Los endpoints GET son públicos; para operaciones de escritura (POST/PATCH/PUT/DELETE) se requiere el header x-api-key.',
    )
    .setVersion('1.0.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description:
          'Se requiere para operaciones de escritura (POST/PATCH/PUT/DELETE).',
      },
      'AdminApiKey',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port , '0.0.0.0');
}
bootstrap();
