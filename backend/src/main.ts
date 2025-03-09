import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { APPLICATION_QUEUE_ID } from './constants/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Cors
  app.enableCors({
    origin: ['http://localhost:3000'],
  });

  // Port
  const port = process.env.PORT || 8000;

 

  // // Set up RabbitMQ as the transport layer
  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RABBIT_MQ_URL],
  //     queue: APPLICATION_QUEUE_ID,
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });

  
  await app.listen(port);
}
bootstrap();
