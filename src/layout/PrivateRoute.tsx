import { PATH } from '@/router/path';
import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import { TOKEN } from '@/constants/auth.constant';
import Cookies from 'js-cookie';
import { AccountState, useAccountStore } from '@/store/account.store';
import { Spin } from 'antd';

export default function PrivateRoute() {
  const location = useLocation();
  const { isLoggedIn } = useAccountStore() as AccountState;

  const isLogged = useMemo(() => {
    const tokenExists = !!Cookies.get(TOKEN);

    if (isLoggedIn === false && tokenExists) {
      return true;
    }

    if (isLoggedIn !== undefined) {
      return tokenExists || isLoggedIn;
    }

    return tokenExists;
  }, [isLoggedIn]);

  return isLogged === undefined ? (
    <Spin size='large' fullscreen />
  ) : isLogged ? (
    <MainLayout />
  ) : (
    <Navigate to={PATH.LOGIN} state={{ from: location }} replace />
  );
}
