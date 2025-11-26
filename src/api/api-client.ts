import { REFRESH_TOKEN, TOKEN } from '@/constants/auth.constant';
import { AccountState, useAccountStore } from '@/store/account.store';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

const URL_WITHOUT_AUTH: string[] = ['auth'];

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const onRequest = async (config: AxiosRequestConfig): Promise<any> => {
  const path = config.url?.split('/')[1] || '';
  if (URL_WITHOUT_AUTH.includes(path)) {
    config.baseURL = process.env.NEXT_PUBLIC_API_URL;
    return config;
  }
  const token = Cookies.get(TOKEN);
  if (!token) return config;
  return {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  };
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data;
};

const onResponseError = (error: AxiosError): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  // ❌ Nếu lỗi không phải 401/403 -> reject luôn
  if (error.response?.status !== 401 && error.response?.status !== 403) {
    return Promise.reject(error);
  }

  // ⏳ Đã thử refresh rồi thì không thử lại nữa
  if (originalRequest._retry) {
    return Promise.reject(error);
  }
  originalRequest._retry = true;

  if (isRefreshing) {
    // Chờ request khác refresh xong
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token: string) => {
          // assign Authorization header without replacing AxiosHeaders instance to satisfy TS types
          if (originalRequest.headers) {
            (originalRequest.headers as any).Authorization = `Bearer ${token}`;
          } else {
            originalRequest.headers = {
              Authorization: `Bearer ${token}`,
            } as any;
          }
          resolve(api(originalRequest));
        },
        reject,
      });
    });
  }

  isRefreshing = true;

  return new Promise(async (resolve, reject) => {
    try {
      const data = await refreshToken();

      // Gửi lại tất cả request đang chờ
      failedQueue.forEach((prom) => {
        prom.resolve(data.token);
        if (originalRequest.headers) {
          (originalRequest.headers as any).Authorization =
            `Bearer ${data.token}`;
        } else {
          originalRequest.headers = {
            Authorization: `Bearer ${data.token}`,
          } as any;
        }
      });

      resolve(api(originalRequest));
    } catch (err) {
      failedQueue.forEach((prom) => prom.reject(err));
      failedQueue = [];

      // Nếu refresh fail → Logout
      Cookies.remove(TOKEN);
      Cookies.remove(REFRESH_TOKEN);

      (useAccountStore.getState() as AccountState).setIsLoggedIn(false);
      useAccountStore.persist.clearStorage();

      if (typeof window !== 'undefined') {
        window.location.href = `/signin`;
      }

      reject(err);
    } finally {
      isRefreshing = false;
      failedQueue = [];
    }
  });
};

const refreshToken = async () => {
  try {
    const token = Cookies.get(TOKEN);
    const refreshToken = Cookies.get(REFRESH_TOKEN);

    if (!token || !refreshToken) throw new Error('Missing tokens');

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/authentication/refresh-token`,
      {
        token,
        refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Lưu token mới
    Cookies.set(TOKEN, res.data.token);
    Cookies.set(REFRESH_TOKEN, res.data.refreshToken);

    return res.data; // return { token, refreshToken }
  } catch (e) {
    throw e;
  }
};

api.interceptors.request.use(onRequest, onRequestError);
api.interceptors.response.use(onResponse, onResponseError);
