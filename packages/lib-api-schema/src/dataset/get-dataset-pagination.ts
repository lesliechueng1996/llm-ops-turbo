import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import {
  paginationReqSchema,
  wrapSuccessPaginationDataSchema,
} from '../common';

export const getDatasetPaginationReqSchema = z
  .object({
    searchWord: z.string().optional().default('').describe('搜索关键词'),
  })
  .merge(paginationReqSchema);

export type GetDatasetPaginationReq = z.infer<
  typeof getDatasetPaginationReqSchema
>;

export class GetDatasetPaginationReqDto extends createZodDto(
  extendApi(getDatasetPaginationReqSchema),
) {}

export const getDatasetPaginationResSchema = wrapSuccessPaginationDataSchema(
  z.object({
    id: z.string().describe('知识库ID'),
    name: z.string().describe('知识库名称'),
    icon: z.string().describe('知识库图标'),
    description: z.string().describe('知识库描述'),
    documentCount: z.number().describe('文档数量'),
    characterCount: z.number().describe('字符数量'),
    relatedAppCount: z.number().describe('关联应用数量'),
    updatedAt: z.number().describe('更新时间'),
    createdAt: z.number().describe('创建时间'),
  }),
);

export type GetDatasetPaginationRes = z.infer<
  typeof getDatasetPaginationResSchema
>;

export class GetDatasetPaginationResDto extends createZodDto(
  getDatasetPaginationResSchema,
) {}
