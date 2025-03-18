import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const UpdateAvatarReqSchema = z.object({
  avatar: z
    .string({
      message: '头像不能为空',
    })
    .url({
      message: '头像必须是一个有效的 URL',
    })
    .describe('头像'),
});

export type UpdateAvatarReq = z.infer<typeof UpdateAvatarReqSchema>;

export class UpdateAvatarReqDto extends createZodDto(
  extendApi(UpdateAvatarReqSchema),
) {}

export const UpdatePasswordReqSchema = z.object({
  password: z
    .string({ message: '密码不能为空' })
    .min(8, { message: '密码长度不能小于8位' })
    .max(16, { message: '密码长度不能大于16位' })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/, {
      message: '密码必须包含至少一个字母和一个数字',
    })
    .describe('密码'),
});

export type UpdatePasswordReq = z.infer<typeof UpdatePasswordReqSchema>;

export class UpdatePasswordReqDto extends createZodDto(
  extendApi(UpdatePasswordReqSchema),
) {}

export const UpdateNameReqSchema = z.object({
  name: z
    .string({ message: '昵称不能为空' })
    .min(3, { message: '昵称长度不能小于3位' })
    .max(30, { message: '昵称长度不能大于30位' })
    .describe('昵称'),
});

export type UpdateNameReq = z.infer<typeof UpdateNameReqSchema>;

export class UpdateNameReqDto extends createZodDto(
  extendApi(UpdateNameReqSchema),
) {}
