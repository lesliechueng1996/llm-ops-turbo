import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

type DataType = {
  name: string;
};

@Processor('document')
export class DocumentConsumer extends WorkerHost {
  private readonly logger = new Logger(DocumentConsumer.name);

  async process(job: Job<DataType, void, string>) {
    this.logger.log(
      `处理任务 ID: ${job.id}, name: ${job.name}, 数据: ${JSON.stringify(job.data)}`,
    );
    return true;
  }
}
