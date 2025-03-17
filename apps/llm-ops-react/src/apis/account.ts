import { get } from '@/lib/http';
import { GetAccountRes } from '@repo/lib-api-schema';

export const getCurrentAccount = async () => get<GetAccountRes>('/account');
