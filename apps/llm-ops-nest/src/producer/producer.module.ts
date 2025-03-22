import { Global, Module } from '@nestjs/common';
import { DemoProducer } from './demo.producer';
import { BullModule } from '@nestjs/bullmq';

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
