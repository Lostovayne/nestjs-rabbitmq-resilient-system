import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

interface UserCreatedEvent {
  email: string;
  name: string;
}

@Controller()
export class AppController {
  @EventPattern('user_created')
  async handleUserCreated(
    @Payload() data: UserCreatedEvent,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log(`📨 [Worker] Recibido evento para: ${data.email}`);

    try {
      // Simular tarea pesada (ej. generar PDF o llamar a AWS SES)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`✅ [Worker] Proceso completado para ${data.name}`);

      // CONFIRMACIÓN MANUAL (ACK)
      // Solo ahora RabbitMQ borra el mensaje.
      channel.ack(originalMsg);
    } catch (error) {
      console.error('❌ Error procesando mensaje', error);
      // Si falla, NO hacemos ack. RabbitMQ reenviará el mensaje
      // (Ojo: esto puede crear bucles infinitos, lo resolveremos con DLQ en el futuro)
    }
  }
}
