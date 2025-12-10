import { useQuery } from '@tanstack/react-query';
import { getUserByIdAPI } from '@/api/user.api';
import { BaseResponse } from '@/types/response.type';
import { UserDetailDto } from '@/types/user/user.dto';

export const USER_QUERY_KEY = 'user';

export const useUserQuery = (id: string, enabled: boolean = true) => {
  return useQuery<BaseResponse<UserDetailDto>>({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => getUserByIdAPI(id),
    enabled: enabled && !!id,
  });
};
