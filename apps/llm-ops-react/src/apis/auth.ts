import { ApiError, baseUrl } from '@/lib/http';
import {
  BaseResponse,
  CredentialReq,
  CredentialRes,
} from '@repo/lib-api-schema';

export const credentialLogin = async (req: CredentialReq) => {
  try {
    const response = await fetch(`${baseUrl}/auth/credential`, {
      method: 'POST',
      body: JSON.stringify(req),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = (await response.json()) as BaseResponse<CredentialRes>;

    if (!response.ok) {
      throw new ApiError(result.message);
    }

    return result.data;
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }

    throw new ApiError('登录失败');
  }
};
