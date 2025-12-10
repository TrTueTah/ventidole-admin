import { BaseResponse, PagingBaseRESP } from '@/types/response.type';
import { UserDetailDto, UserDto } from '@/types/user/user.dto';
import { CreateUserREQ, GetUsersREQ } from '@/types/user/user.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getUsersAPI = async (
  data: GetUsersREQ
): Promise<PagingBaseRESP<UserDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.USER.get()}`,
    { params: data }
  );
};

export const getUserByIdAPI = async (
  id: string
): Promise<BaseResponse<UserDetailDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.USER.get(id)}`
  );
};

export const createUserAPI = async (
  data: CreateUserREQ
): Promise<BaseResponse<UserDetailDto>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.USER.get()}`,
    data
  );
};
