import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationWithErrorResponse } from '../../decorator/swagger.decorator';
import {
  CreateDocumentsReqDto,
  CreateDocumentsResDto,
} from '@repo/lib-api-schema';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { DocumentService } from './document.service';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AlsContext } from '../../common/als/als.type';

@ApiTags('Document')
@Controller('dataset/:datasetId/document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly als: AsyncLocalStorage<AlsContext>,
  ) {}

  @Post()
  @ApiOperationWithErrorResponse({
    summary: '创建文档',
    description: '创建文档',
    body: CreateDocumentsReqDto,
    response: CreateDocumentsResDto,
  })
  @UseGuards(JwtAuthGuard)
  async createDocuments(
    @Param('datasetId') datasetId: string,
    @Body() body: CreateDocumentsReqDto,
  ) {
    const accountId = this.als.getStore()?.accountId ?? '';
    return this.documentService.createDocuments(accountId, datasetId, body);
  }
}
