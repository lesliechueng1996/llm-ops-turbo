import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AccountModule } from './api/account/account.module';
import { AuthModule } from './api/auth/auth.module';
import { OauthModule } from './api/oauth/oauth.module';
import { UploadFileModule } from './api/upload-file/upload-file.module';
import { AlsMiddleware } from './common/als/als.middleware';
import { AlsModule } from './common/als/als.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        stores: [createKeyv(configService.get('REDIS_URL'))],
      }),
    }),
    AlsModule,
    PrismaModule,
    AuthModule,
    AccountModule,
    OauthModule,
    UploadFileModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
