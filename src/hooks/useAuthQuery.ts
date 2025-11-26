import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { loginAPI } from '@/api/auth.api';
import { LoginREQ } from '@/types/auth/auth.req';
import { LoginRESP } from '@/types/auth/auth.res';
import { BaseResponse } from '@/types/response.type';
import { useAccountStore } from '@/store/account.store';
import { TOKEN } from '@/constants/auth.constant';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';

/**
 * Hook for login mutation
 * Handles authentication, token storage, and user state management
 * @example
 * const loginMutation = useLogin();
 * loginMutation.mutate(
 *   { email: 'user@example.com', password: 'pass' },
 *   {
 *     onSuccess: () => router.push('/dashboard'),
 *     onError: (error) => console.error(error)
 *   }
 * );
 */
export function useLogin(): UseMutationResult<
  BaseResponse<LoginRESP>,
  AxiosError,
  LoginREQ
> {
  const setAccount = useAccountStore((state) => state.setAccount);

  return useMutation({
    mutationFn: loginAPI,
    onSuccess: (response) => {
      const data = response.data;

      // Store access token in cookies
      if (data.accessToken) {
        Cookies.set(TOKEN, data.accessToken, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }

      // Store refresh token if needed (optional, based on your strategy)
      if (data.refreshToken) {
        Cookies.set('refresh_token', data.refreshToken, {
          expires: 30, // 30 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }

      // Update account store with user data
      setAccount(data.userId, data.name, data.email);
    },
    onError: (error) => {
      // Clear any existing tokens on error
      Cookies.remove(TOKEN);
      Cookies.remove('refresh_token');
      console.error('Login failed:', error);
    },
  });
}
