import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerModule } from './consumer/consumer.module';
import { IndexModule } from './index/index.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    ConsumerModule,
    IndexModule,
  ],
})
export class AppModule {}
