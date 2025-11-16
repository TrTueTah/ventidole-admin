import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/path';
import { ICONS } from '@/config/icons';
import { TOKEN } from '@/constants/auth.constant';
import Cookies from 'js-cookie';
import { useAccountStore } from '@/store/account.store';

type IconButtonProps = {
  onClick: () => void;
  iconSrc: string;
  buttonText: string;
};

const IconButton = ({ onClick, iconSrc, buttonText }: IconButtonProps) => (
  <Button type='text' className='icon-button-change-info' onClick={onClick}>
    <img src={iconSrc} alt='icon' />
    <span>{buttonText}</span>
  </Button>
);

type ContentPopupChangeInfoProps = {
  onOpenChange: (open: boolean) => void;
};

export default function ContentPopupChangeInfo({ onOpenChange }: ContentPopupChangeInfoProps) {

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove(TOKEN);
    useAccountStore.persist.clearStorage();
    navigate(PATH.LOGIN);
  };

  const handleClickChangePasswordBtn = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <div className='flex flex-col w-60'>
      <IconButton
        onClick={() => handleClickChangePasswordBtn(PATH.CHANGE_PASSWORD)}
        iconSrc={ICONS.PencilSimple}
        buttonText={'Change Password'}
      />
      {/* <IconButton
        onClick={() => handleClickChangePasswordBtn(PATH.CHANGE_SECONDARY_PASSWORD)}
        iconSrc={ICONS.PencilSimple}
        buttonText={tButton('change_secondary_password')}
      /> */}
      <div className='border-0 border-t border-solid border-ventidole-neutral-30 mx-5' />
      <IconButton onClick={handleLogout} iconSrc={ICONS.SignOut} buttonText={'Log Out'} />
    </div>
  );
}
