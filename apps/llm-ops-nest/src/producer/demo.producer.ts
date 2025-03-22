import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class DemoProducer {
  constructor(@InjectQueue('demo') private readonly demoQueue: Queue) {}

  async test() {
    return this.demoQueue.add(
      'test',
      {
        name: 'test',
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
