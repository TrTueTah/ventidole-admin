/**
 * Query keys for React Query
 * Organized by domain/feature
 */
export const QUERY_KEYS = {
  AUTH: {
    LOGIN: ['auth', 'login'],
    LOGOUT: ['auth', 'logout'],
    ME: ['auth', 'me'],
    REFRESH: ['auth', 'refresh'],
  },
  USER: {
    ALL: ['users'],
    DETAIL: (id: string) => ['users', id],
    PROFILE: ['users', 'profile'],
  },
  // Add more query keys as needed
} as const;
