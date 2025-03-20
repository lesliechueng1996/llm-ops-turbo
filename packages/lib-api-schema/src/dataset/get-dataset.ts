import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

export const GetDatasetResSchema = z.object({
  id: z.string().describe('知识库ID'),
  name: z.string().describe('知识库名称'),
  icon: z.string().describe('知识库图标'),
  description: z.string().describe('知识库描述'),
  documentCount: z.number().describe('文档数量'),
  hitCount: z.number().describe('命中数量'),
  relatedAppCount: z.number().describe('关联应用数量'),
  characterCount: z.number().describe('字符数量'),
  createdAt: z.number().describe('创建时间'),
  updatedAt: z.number().describe('更新时间'),
});

export type GetDatasetRes = z.infer<typeof GetDatasetResSchema>;

export class GetDatasetResDto extends createZodDto(
  extendApi(GetDatasetResSchema),
) {}
