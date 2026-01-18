import { useQuery } from '@tanstack/react-query';
import { getCurrentUserAPI } from '@/api/user.api';
import { QUERY_KEYS } from '@/constants/query-keys.constant';
import { useAccountStore } from '@/store/account.store';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { TOKEN } from '@/constants/auth.constant';

export const useCurrentUser = () => {
  const { setAccount } = useAccountStore();
  const token = Cookies.get(TOKEN);

  const query = useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: getCurrentUserAPI,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    enabled: !!token, // Only fetch when user is authenticated
  });

  useEffect(() => {
    if (query.data?.data) {
      const user = query.data.data;
      setAccount(user.id, user.username, user.email, user.role);
    }
  }, [query.data, setAccount]);

  return query;
};
