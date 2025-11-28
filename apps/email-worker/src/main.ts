/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'notifications_queue', // Misma cola que el producer
        noAck: false, // <--- IMPORTANTE: Desactivamos auto-confirmación
        queueOptions: {
          durable: true,
        },
        prefetchCount: 1, // Balanceo de carga (1 mensaje a la vez)
      },
    }
  );

  await app.listen();
  console.log('🚀 [Worker] Email Service escuchando RabbitMQ v4...');
}
bootstrap();
