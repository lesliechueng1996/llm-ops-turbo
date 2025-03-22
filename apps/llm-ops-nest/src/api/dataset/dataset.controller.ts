import { AsyncLocalStorage } from 'node:async_hooks';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateDatasetReqDto,
  GetDatasetPaginationReqDto,
  GetDatasetPaginationResDto,
  GetDatasetResDto,
  SuccessEmptyResponseDto,
  UpdateDatasetReqDto,
} from '@repo/lib-api-schema';
import { AlsContext } from '../../common/als/als.type';
import { ApiOperationWithErrorResponse } from '../../decorator/swagger.decorator';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { DatasetService } from './dataset.service';

@ApiTags('Dataset')
@Controller('dataset')
export class DatasetController {
  constructor(
    private readonly datasetService: DatasetService,
    private readonly als: AsyncLocalStorage<AlsContext>,
  ) {}

  @ApiOperationWithErrorResponse({
    summary: '创建知识库',
    description: '创建知识库',
    body: CreateDatasetReqDto,
    response: SuccessEmptyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDataset(@Body() body: CreateDatasetReqDto) {
    const accountId = this.als.getStore()?.accountId ?? '';
    const { name, description, icon } = body;
    const isExists = await this.datasetService.isNameExists(name, accountId);
    if (isExists) {
      throw new BadRequestException('知识库名称已存在');
    }

    await this.datasetService.createDataset(accountId, name, icon, description);
  }

  @ApiOperationWithErrorResponse({
    summary: '获取知识库分页列表',
    description: '获取知识库分页列表',
    response: GetDatasetPaginationResDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getDatasetPagination(@Query() query: GetDatasetPaginationReqDto) {
    const accountId = this.als.getStore()?.accountId ?? '';
    return this.datasetService.getDatasetPagination(accountId, query);
  }

  @ApiOperationWithErrorResponse({
    summary: '获取知识库详情',
    description: '获取知识库详情',
    response: GetDatasetResDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDataset(@Param('id') id: string) {
    const accountId = this.als.getStore()?.accountId ?? '';
    return this.datasetService.getDatasetById(id, accountId);
  }

  @ApiOperationWithErrorResponse({
    summary: '更新知识库',
    description: '更新知识库',
    body: UpdateDatasetReqDto,
    response: SuccessEmptyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateDataset(
    @Body() body: UpdateDatasetReqDto,
    @Param('id') id: string,
  ) {
    const accountId = this.als.getStore()?.accountId ?? '';
    const { name, description, icon } = body;

    await this.datasetService.getDatasetById(id, accountId);

    const isExists = await this.datasetService.isNameExistsExceptId(
      name,
      accountId,
      id,
    );
    if (isExists) {
      throw new BadRequestException('知识库名称已存在');
    }

    await this.datasetService.updateDataset(id, name, icon, description);
  }

  @ApiOperationWithErrorResponse({
    summary: '删除知识库',
    description: '删除知识库',
    response: SuccessEmptyResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDataset(@Param('id') id: string) {
    const accountId = this.als.getStore()?.accountId ?? '';
    await this.datasetService.getDatasetById(id, accountId);
    await this.datasetService.deleteDataset(id);
  }
}
