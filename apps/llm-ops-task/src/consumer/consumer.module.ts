import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DemoConsumer } from './demo.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo',
    }),
  ],
  providers: [DemoConsumer],
})
export class ConsumerModule {}
