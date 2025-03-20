import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { wrapResponseSchema } from '../common';

export const RefreshTokenReqSchema = z.object({
  refreshToken: z
    .string({ message: '刷新令牌不能为空' })
    .uuid({ message: '刷新令牌格式不正确' })
    .describe('刷新令牌'),
  accountId: z.string({ message: '用户ID不能为空' }).describe('用户ID'),
});

export type RefreshTokenReq = z.infer<typeof RefreshTokenReqSchema>;

export class RefreshTokenReqDto extends createZodDto(
  extendApi(RefreshTokenReqSchema),
) {}

export const RefreshTokenResSchema = z.object({
  accessToken: z.string().describe('访问令牌'),
  refreshToken: z.string().describe('刷新令牌'),
});

export type RefreshTokenRes = z.infer<typeof RefreshTokenResSchema>;

export class RefreshTokenResDto extends createZodDto(
  extendApi(wrapResponseSchema(RefreshTokenResSchema)),
) {}
