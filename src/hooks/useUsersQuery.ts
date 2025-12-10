import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetUsersREQ } from '@/types/user/user.req';
import { UserDto } from '@/types/user/user.dto';
import { getUsersAPI } from '@/api/user.api';

export const USERS_QUERY_KEY = 'users';

export const useUsersQuery = (params: GetUsersREQ) => {
  return useQuery<PagingBaseRESP<UserDto[]>>({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: () => getUsersAPI(params),
  });
};
