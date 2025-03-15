import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CredentialReqSchema = z.object({
  email: z
    .string({ message: '邮箱不能为空' })
    .email({ message: '邮箱格式不正确' })
    .describe('邮箱'),
  password: z
    .string({ message: '密码不能为空' })
    .min(8, { message: '密码长度不能小于8位' })
    .max(16, { message: '密码长度不能大于16位' })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/, {
      message: '密码必须包含至少一个字母和一个数字',
    })
    .describe('密码'),
});

export type CredentialReq = z.infer<typeof CredentialReqSchema>;

export class CredentialReqDto extends createZodDto(CredentialReqSchema) {}

export const CredentialResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type CredentialRes = z.infer<typeof CredentialResSchema>;
