import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BullModule } from '@nestjs/bullmq';
import {
  NODE_EXECUTION_QUEUE,
  WORKFLOW_EXECUTION_QUEUE,
} from './value-objects/bullmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
