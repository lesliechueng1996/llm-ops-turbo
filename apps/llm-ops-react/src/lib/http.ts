import useCredentialStore from '@/stores/credential';
import { BaseResponse, RefreshTokenRes } from '@repo/lib-api-schema';
import { jwtDecode } from 'jwt-decode';
import qs from 'qs';

export const baseUrl = 'http://localhost:3000/api';

export class ApiError extends Error {}

export class AuthError extends Error {}

const isJwtWillExpire = (jwt: string, minutes: number) => {
  try {
    const decoded = jwtDecode(jwt);
    const now = new Date();
    if (!decoded.exp) {
      return true;
    }
    const expiration = new Date(decoded.exp * 1000);
    const timeDiff = expiration.getTime() - now.getTime();
    return timeDiff <= minutes * 60 * 1000;
  } catch (error) {
    return true;
  }
};

let refreshTokenPromise: Promise<string> | null = null;

const refreshToken = async (): Promise<string> => {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = new Promise<string>((resolve, reject) => {
    const { accessToken, refreshToken } = useCredentialStore.getState();
    if (!accessToken || !refreshToken) {
      useCredentialStore.getState().clear();
      reject(new AuthError('请重新登录'));
      return;
    }

    try {
      const decoded = jwtDecode(refreshToken);
      if (!decoded.sub) {
        useCredentialStore.getState().clear();
        reject(new AuthError('请重新登录'));
        return;
      }

      const accountId = decoded.sub;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ accountId, refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })
        .then((response) => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new AuthError('刷新令牌失败');
          }
          return response.json();
        })
        .then((result) => {
          const data = result.data as RefreshTokenRes;
          if (!data || !data.accessToken || !data.refreshToken) {
            throw new AuthError('刷新令牌响应无效');
          }

          useCredentialStore
            .getState()
            .setCredential(data.accessToken, data.refreshToken);
          resolve(data.accessToken);
        })
        .catch((error) => {
          useCredentialStore.getState().clear();
          reject(
            error instanceof AuthError ? error : new AuthError('请重新登录'),
          );
        });
    } catch (error) {
      useCredentialStore.getState().clear();
      reject(new AuthError('请重新登录'));
    }
  }).finally(() => {
    refreshTokenPromise = null;
  });

  return refreshTokenPromise;
};

type FetchOptions = Omit<RequestInit, 'body'> & {
  query?: Record<string, string | number | boolean>;
  body?: BodyInit | Record<string, unknown> | null;
  maxRetries?: number;
  currentRetry?: number;
  timeout?: number;
};

const request = async <T>(
  url: string,
  fetchOptions: FetchOptions,
): Promise<BaseResponse<T>> => {
  const {
    query,
    method,
    body,
    maxRetries = 1,
    currentRetry = 0,
    timeout = 30000, // 默认30秒超时
    ...rest
  } = fetchOptions;

  // 检查重试次数，防止无限递归
  if (currentRetry > maxRetries) {
    throw new ApiError('请求失败，已达到最大重试次数');
  }

  const options: RequestInit = {
    ...rest,
    method,
  };

  // 构建URL
  let finalUrl: string;
  if (url.startsWith('http')) {
    finalUrl = url;
  } else {
    finalUrl = `${baseUrl}${url}`;
  }

  if (query) {
    const queryString = qs.stringify(query);
    finalUrl = `${finalUrl}${finalUrl.includes('?') ? '&' : '?'}${queryString}`;
  }

  const headers = new Headers(options.headers);

  if (
    body &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer)
  ) {
    options.body = JSON.stringify(body);
    headers.set('Content-Type', 'application/json');
  }

  // 每次请求时获取最新的状态
  const { accessToken } = useCredentialStore.getState();
  console.log(accessToken);
  if (!accessToken) {
    throw new AuthError('请重新登录');
  }

  headers.set('Authorization', `Bearer ${accessToken}`);
  options.headers = headers;

  // 设置请求超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  options.signal = controller.signal;

  try {
    // 检查token是否即将过期
    if (isJwtWillExpire(accessToken, 5)) {
      try {
        const newAccessToken = await refreshToken();
        headers.set('Authorization', `Bearer ${newAccessToken}`);
        options.headers = headers;
      } catch (error) {
        throw new AuthError('请重新登录');
      }
    }

    const response = await fetch(finalUrl, options);
    clearTimeout(timeoutId);

    if (response.status === 401 && currentRetry < maxRetries) {
      try {
        await refreshToken();
        // 递归调用，但增加重试计数
        return request<T>(url, {
          ...fetchOptions,
          currentRetry: currentRetry + 1,
        });
      } catch (error) {
        throw new AuthError('请重新登录');
      }
    }

    if (response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        }
        throw new ApiError('响应不是有效的JSON格式');
      } catch (error) {
        throw new ApiError('解析响应失败');
      }
    }

    try {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || `请求失败，状态码: ${response.status}`,
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`请求失败，状态码: ${response.status}`);
    }
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof AuthError || error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('请求超时');
    }
    throw new ApiError((error as Error).message || '网络请求失败');
  }
};

export const get = <T>(url: string, options: FetchOptions = {}) => {
  return request<T>(url, { ...options, method: 'GET' });
};

export const post = <T>(url: string, options: FetchOptions = {}) => {
  return request<T>(url, { ...options, method: 'POST' });
};

export const put = <T>(url: string, options: FetchOptions = {}) => {
  return request<T>(url, { ...options, method: 'PUT' });
};

export const del = <T>(url: string, options: FetchOptions = {}) => {
  return request<T>(url, { ...options, method: 'DELETE' });
};
