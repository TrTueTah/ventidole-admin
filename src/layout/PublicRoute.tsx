import { TOKEN } from '@/constants/auth.constant';
import Login from '@/pages/auth/login/page';
import Cookies from 'js-cookie';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute() {
  const token = Cookies.get(TOKEN);
  const isLoggedIn = useMemo(() => !!token, [token]);

  return isLoggedIn ? <Navigate to='/' replace /> : <Login />;
}
