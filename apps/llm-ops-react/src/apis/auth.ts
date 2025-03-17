import { ApiError, baseUrl } from '@/lib/http';
import useCredentialStore from '@/stores/credential';
import {
  AuthorizeGithubRes,
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

export const oauthGithub = async (code: string) => {
  try {
    const response = await fetch(
      `${baseUrl}/oauth/authorize/github?code=${code}`,
    );

    const result = (await response.json()) as BaseResponse<AuthorizeGithubRes>;

    if (!response.ok) {
      throw new ApiError(result.message);
    }

    return result.data;
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    }

    throw new ApiError('授权失败');
  }
};

export const logout = async () => {
  const { accessToken } = useCredentialStore.getState();

  return fetch(`${baseUrl}/auth/logout`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
