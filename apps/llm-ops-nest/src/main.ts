import { ConsoleLogger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filter/global-exception.filter';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { ZodValidationPipe } from '@repo/lib-api-schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'warn', 'log', 'debug'],
      prefix: 'LLM-OPS-NEST',
    }),
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('LLM Ops API')
    .setDescription('The LLM Ops API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, documentFactory);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(new ZodValidationPipe());

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
