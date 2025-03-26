import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { DemoProducer } from './demo.producer';
import { DocumentProducer } from './document.producer';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo',
    }),
    BullModule.registerQueue({
      name: 'document',
    }),
  ],
  providers: [DemoProducer, DocumentProducer],
  exports: [DemoProducer, DocumentProducer],
})
export class ProducerModule {}
