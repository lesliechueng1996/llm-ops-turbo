import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const GenerateCredentialReqSchema = z.object({
  fileName: z.string({ message: '文件名不可为空' }).describe('上传文件名'),
  fileSize: z
    .union([
      z.string().transform((val) => Number.parseInt(val, 10)),
      z.number(),
    ])
    .pipe(z.number().positive({ message: '文件大小必须为正数' }))
    .describe('上传文件大小(Bytes)'),
});

export type GenerateCredentialReq = z.infer<typeof GenerateCredentialReqSchema>;

export class GenerateCredentialReqDto extends createZodDto(
  extendApi(GenerateCredentialReqSchema),
) {}

export const GenerateCredentialResSchema = z.object({
  credential: z.object({
    tmpSecretId: z.string().describe('临时上传凭证 ID'),
    tmpSecretKey: z.string().describe('临时上传凭证 Key'),
    sessionToken: z.string().describe('临时上传 Token'),
    startTime: z.number().describe('临时上传起始时间'),
    expiredTime: z.number().describe('临时上传过期时间'),
  }),
  key: z.string().describe('文件 Key'),
  bucket: z.object({
    schema: z.string().describe('上传 Bucket schema'),
    name: z.string().describe('上传 Bucket name'),
    region: z.string().describe('上传 Bucket region'),
  }),
});

export type GenerateCredentialRes = z.infer<typeof GenerateCredentialResSchema>;

export class GenerateCredentialResDto extends createZodDto(
  extendApi(GenerateCredentialResSchema),
) {}
