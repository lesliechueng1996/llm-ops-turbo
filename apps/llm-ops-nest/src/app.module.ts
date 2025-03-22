import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from './api/account/account.module';
import { AuthModule } from './api/auth/auth.module';
import { DatasetModule } from './api/dataset/dataset.module';
import { OauthModule } from './api/oauth/oauth.module';
import { UploadFileModule } from './api/upload-file/upload-file.module';
import { AlsMiddleware } from './common/als/als.middleware';
import { AlsModule } from './common/als/als.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { HealthModule } from './api/health/health.module';
import { ProducerModule } from './producer/producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUsername = configService.get('REDIS_USERNAME') || '';
        const redisPassword = configService.get('REDIS_PASSWORD') || '';
        const redisHost = configService.get('REDIS_HOST');
        const redisPort = configService.get('REDIS_PORT');
        const redisDb = configService.get('REDIS_DB');

        let redisUrl = 'redis://';
        if (redisUsername && redisPassword) {
          redisUrl += `${redisUsername}:${redisPassword}@`;
        }
        redisUrl += `${redisHost}:${redisPort}/${redisDb}`;

        return {
          stores: [createKeyv(redisUrl)],
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          db: configService.get('REDIS_QUEUE_DB'),
        },
      }),
      inject: [ConfigService],
    }),
    ProducerModule,
    AlsModule,
    PrismaModule,
    AuthModule,
    AccountModule,
    OauthModule,
    UploadFileModule,
    DatasetModule,
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*path');
  }
}
