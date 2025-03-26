import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'log', 'debug'],
      prefix: 'LLM-OPS-TASK',
    }),
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
