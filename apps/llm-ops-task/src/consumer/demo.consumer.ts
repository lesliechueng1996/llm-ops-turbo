import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

type DataType = {
  name: string;
};

@Processor('demo')
export class DemoConsumer extends WorkerHost {
  private readonly logger = new Logger(DemoConsumer.name);

  async process(job: Job<DataType, void, string>) {
    this.logger.log(
      `处理任务 ID: ${job.id}, 数据: ${JSON.stringify(job.data)}`,
    );
    return true;
  }
}
