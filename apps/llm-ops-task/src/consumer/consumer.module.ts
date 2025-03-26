import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DemoConsumer } from './demo.consumer';
import { DocumentConsumer } from './document.consumer';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo',
    }),
    BullModule.registerQueue({
      name: 'document',
    }),
  ],
  providers: [DemoConsumer, DocumentConsumer],
})
export class ConsumerModule {}
