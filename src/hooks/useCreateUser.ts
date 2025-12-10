import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserAPI } from '@/api/user.api';
import { CreateUserREQ } from '@/types/user/user.req';
import { USERS_QUERY_KEY } from './useUsersQuery';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserREQ) => createUserAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};
