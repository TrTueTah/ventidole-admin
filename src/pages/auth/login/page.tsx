import { Button, Form, notification } from 'antd';
import { TextInput } from '@/components/form/TextInput';
import { getLoginSchema } from '@/schemas/login.schema';
import { LoginREQ } from '@/services/auth/auth.req';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginAPI } from '@/apis/auth.api';
import { TOKEN } from '@/constants/auth.constant';
import { ICONS } from '@/config/icons';
import Cookies from 'js-cookie';
import { useMutation } from '@tanstack/react-query';
import { AccountState, useAccountStore } from '@/store/account.store';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountInfo, setAccountInfo, setIsLoggedIn } = useAccountStore() as AccountState;

  const { isPending: isLoggingIn, mutate: mutateLogin } = useMutation({
    mutationFn: loginAPI,
    onSuccess: (response) => {
      console.log('data', response);
      const { accessToken } = response.data;
      if (accessToken) {
        Cookies.set(TOKEN, accessToken, { expires: 365 });

        const fromLocation = location.state?.from || { pathname: '/' };
        console.log('fromLocation', fromLocation);
        if (fromLocation.pathname === '/') {
          navigate('/');
        } else {
          navigate(`${fromLocation.pathname}${fromLocation.search}`, { replace: true });
        }

        const { userId, name, email } = response.data;
        setAccountInfo({
          userId,
          name,
          email
        });
        setIsLoggedIn(true);
        notification.success({
          message: 'Login successful',
        });
      }
    },
    onError: () => {
      notification.error({
        message: 'Login failed',
      });
    },
  });

  const onFinish = async (values: LoginREQ) => {
    setAccountInfo({
      ...accountInfo,
      email: values.email,
    });
    mutateLogin(values);
  };

  return (
    <div className='h-screen bg-ventidole-neutral-20 flex px-5'>
      <div className='w-full md:max-w-[416px] m-auto px-5 md:px-12 py-16 flex flex-col bg-white rounded-10'>
        <div className='flex flex-col gap-[1.66px] mx-auto'>
          <img className='w-[200px] h-10 md:w-[225px] md:h-10' src={ICONS.Logo} alt='logo' />
        </div>
        <Form name='login' onFinish={onFinish} className='flex flex-col gap-6 pt-2.5 md:pt-12'>
          <TextInput
            formItemName='email'
            label={'Email'}
            placeholder={'Email'}
            rules={getLoginSchema().email}
            isVerticalLabel
            isHideRequired
          />

          <TextInput
            formItemName='password'
            label={'Password'}
            placeholder={'Password'}
            rules={getLoginSchema().password}
            type='password'
            isVerticalLabel
            isHideRequired
          />
          <Button htmlType='submit' type='primary' className='h-11 text-base font-medium mt-2' loading={isLoggingIn}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}
