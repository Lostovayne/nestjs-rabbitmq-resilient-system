import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

class CreateUserDto {
  email: string;
  name: string;
}

@Controller('auth')
export class AppController {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy
  ) {}

  @Post('register')
  async registerUser(@Body() data: CreateUserDto) {
    // 1. Aquí iría la lógica de persistencia en BD (Postgres/Mongo)
    console.log(`📝 [API] Usuario registrado: ${data.email}`);

    // 2. Emitir evento asíncrono (Fire & Forget)
    // No esperamos respuesta del worker. RabbitMQ se encarga.
    this.client.emit('user_created', data);

    // 3. Responder al cliente inmediatamente
    return {
      message: 'Usuario registrado exitosamente',
      status: 'pending_verification',
    };
  }
}
