import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { wrapResponseSchema } from '../common';

export const SaveFileReqSchema = z.object({
  file: z.instanceof(File).describe('文件'),
});

export type SaveFileReq = z.infer<typeof SaveFileReqSchema>;

export class SaveFileReqDto extends createZodDto(
  extendApi(SaveFileReqSchema),
) {}

export const SaveFileResSchema = z.object({
  id: z.string().describe('文件ID'),
  accountId: z.string().describe('账户ID'),
  name: z.string().describe('文件名'),
  size: z.number().describe('文件大小(Byte)'),
  key: z.string().describe('文件key'),
  extension: z.string().describe('文件扩展名'),
  mimeType: z.string().describe('文件类型'),
  createdAt: z.number().describe('创建时间'),
});

export type SaveFileRes = z.infer<typeof SaveFileResSchema>;

export class SaveFileResDto extends createZodDto(
  extendApi(wrapResponseSchema(SaveFileResSchema)),
) {}
