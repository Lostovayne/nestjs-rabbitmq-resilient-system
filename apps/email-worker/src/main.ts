/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Creamos un contexto temporal solo para leer el .env
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  // 2. LEER VARIABLES (Validando que existan)
  const rmqUrl = configService.getOrThrow<string>('RABBITMQ_URI');
  const queueName = configService.getOrThrow<string>('RABBITMQ_QUEUE');

  // Evitar gastar ram!
  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: queueName, // Misma cola que el producer
        noAck: false, // <--- IMPORTANTE: Desactivamos auto-confirmación
        queueOptions: {
          durable: true,
        },
        prefetchCount: 1, // Balanceo de carga (1 mensaje a la vez)
      },
    }
  );

  await app.listen();
  console.log(`🚀 [Worker] Escuchando en ${queueName} (Configurado vía .env)`);
}
bootstrap();
