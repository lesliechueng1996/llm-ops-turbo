import { get, patch } from '@/lib/http';
import { GetAccountRes } from '@repo/lib-api-schema';

export const getCurrentAccount = async () => get<GetAccountRes>('/account');

export const updatePassword = async (password: string) =>
  patch('/account/password', { body: { password } });

export const updateName = async (name: string) =>
  patch('/account/name', { body: { name } });

export const updateAvatar = async (avatar: string) =>
  patch('/account/avatar', { body: { avatar } });
