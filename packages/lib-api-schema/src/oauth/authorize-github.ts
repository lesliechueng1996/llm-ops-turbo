import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AuthorizeGithubReqSchema = z.object({
  code: z.string({ message: '授权码不能为空' }).describe('GitHub 授权码'),
});

export type AuthorizeGithubReq = z.infer<typeof AuthorizeGithubReqSchema>;

export class AuthorizeGithubReqDto extends createZodDto(
  AuthorizeGithubReqSchema,
) {}

export const AuthorizeGithubResSchema = z.object({
  accessToken: z.string().describe('访问令牌'),
  refreshToken: z.string().describe('刷新令牌'),
});

export type AuthorizeGithubRes = z.infer<typeof AuthorizeGithubResSchema>;

export class AuthorizeGithubResDto extends createZodDto(
  AuthorizeGithubResSchema,
) {}
