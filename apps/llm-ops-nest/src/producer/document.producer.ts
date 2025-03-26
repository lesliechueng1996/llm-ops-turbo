import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class DocumentProducer {
  private readonly logger = new Logger(DocumentProducer.name);

  constructor(@InjectQueue('document') private readonly documentQueue: Queue) {}

  async buildDocuments(documentIds: string[]) {
    this.logger.log(`Building documents: ${documentIds.join(', ')}`);
    return this.documentQueue.add(
      'build-documents',
      {
        documentIds,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
