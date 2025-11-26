import { BaseResponse } from '@/types/response.type';
import { api } from './api-client';
import { LoginREQ } from '@/types/auth/auth.req';
import { LoginRESP } from '@/types/auth/auth.res';
import { ENDPOINTS } from '@/constants/api.constant';

export const loginAPI = async (
  data: LoginREQ
): Promise<BaseResponse<LoginRESP>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.AUTHENTICATION.get('LOGIN')}`,
    data
  );
};
