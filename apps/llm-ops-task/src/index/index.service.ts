import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IndexService {
  private readonly logger = new Logger(IndexService.name);

  async buildDocuments(documentIds: string[]) {
    if (documentIds.length === 0) {
      return;
    }
  }
}
