import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentsReq } from '@repo/lib-api-schema';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DatasetService } from '../dataset/dataset.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { DocumentProducer } from '../../producer/document.producer';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly datasetService: DatasetService,
    private readonly uploadFileService: UploadFileService,
    private readonly documentProducer: DocumentProducer,
  ) {}

  async #getLatestDocumentPosition(datasetId: string) {
    const lastDocument = await this.prisma.document.findFirst({
      where: {
        datasetId,
      },
      orderBy: {
        position: 'desc',
      },
    });
    return lastDocument?.position ?? 0;
  }

  async createDocuments(
    accountId: string,
    datasetId: string,
    data: CreateDocumentsReq,
  ) {
    const dataset = await this.datasetService.getDatasetById(
      datasetId,
      accountId,
    );
    const uploadFiles = await this.uploadFileService.getUploadFiles(
      data.uploadFileIds,
      accountId,
    );
    if (uploadFiles.length === 0) {
      throw new BadRequestException('上传文件不存在');
    }

    const batchId = `${format(new Date(), 'yyyyMMdd')}-${uuidv4()}`;
    let latestPosition = await this.#getLatestDocumentPosition(datasetId);

    const result = await this.prisma.processRule.create({
      include: {
        documents: true,
      },
      data: {
        accountId,
        datasetId,
        mode: data.processType,
        rule: data.rule,
        documents: {
          createMany: {
            data: uploadFiles.map((file) => {
              latestPosition++;
              return {
                accountId,
                datasetId,
                uploadFileId: file.id,
                position: latestPosition,
                batch: batchId,
                name: file.name,
              };
            }),
          },
        },
      },
    });

    await this.documentProducer.buildDocuments(
      result.documents.map((doc) => doc.id),
    );

    return {
      batch: batchId,
      documents: result.documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        status: doc.status,
        createdAt: doc.createdAt,
      })),
    };
  }
}
