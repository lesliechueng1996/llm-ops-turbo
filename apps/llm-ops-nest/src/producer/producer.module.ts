import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { DemoProducer } from './demo.producer';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo',
    }),
  ],
  providers: [DemoProducer],
  exports: [DemoProducer],
})
export class ProducerModule {}
