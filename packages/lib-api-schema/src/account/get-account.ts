import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const GetAccountResSchema = z.object({
  id: z.string().describe('账号ID'),
  name: z.string().describe('账号名称'),
  email: z.string().describe('账号邮箱'),
  avatar: z.string().describe('账号头像'),
  lastLoginAt: z.number().describe('最后登录时间(ms)'),
  lastLoginIp: z.string().describe('最后登录IP'),
  createdAt: z.number().describe('创建时间(ms)'),
});

export type GetAccountRes = z.infer<typeof GetAccountResSchema>;

export class GetAccountResDto extends createZodDto(GetAccountResSchema) {}
