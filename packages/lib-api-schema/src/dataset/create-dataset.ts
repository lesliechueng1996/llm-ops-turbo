import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const createDatasetReqSchema = z.object({
  name: z
    .string()
    .min(1, { message: '知识库名称不能为空' })
    .max(100, {
      message: '知识库名称不能超过100个字符',
    })
    .describe('知识库名称'),
  icon: z
    .string()
    .url({ message: '知识库图标必须是有效的URL' })
    .describe('知识库图标'),
  description: z
    .string()
    .max(2000, {
      message: '知识库描述不能超过2000个字符',
    })
    .optional()
    .describe('知识库描述'),
});

export type CreateDatasetReq = z.infer<typeof createDatasetReqSchema>;

export class CreateDatasetReqDto extends createZodDto(
  extendApi(createDatasetReqSchema),
) {}
