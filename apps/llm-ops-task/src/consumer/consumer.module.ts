import { Module } from '@nestjs/common';
import { DemoConsumer } from './demo.consumer';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo',
    }),
  ],
  providers: [DemoConsumer],
})
export class ConsumerModule {}
