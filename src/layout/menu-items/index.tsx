import { PATH } from '@/router/path';
import { NavigateFunction } from 'react-router-dom';
import {
  Path,
} from '@/enums/path.enum';
import { AccountInfo } from '@/store/account.store';
import { JSX } from 'react';
import IdolManagementIcon from '@/components/icon/IdolManagementIcon';

type MenuItem = {
  key: string;
  label: string;
  icon?: JSX.Element;
  onClick?: () => void;
  children?: MenuItem[];
  disabled?: boolean;
};

type MenuListProps = {
  navigate: NavigateFunction;
  selectedKeys: string;
  accountInfo: AccountInfo;
};

// const createMenuArray = (path: string, values: Record<string, string>) => {
//   return [path, ...Object.values(values)] as string[];
// };

export const getMenuList = ({ navigate, selectedKeys }: MenuListProps): MenuItem[] => {
  return [
    {
      key: Path.IDOL_MANAGEMENT,
      label: 'Idol Management',
      icon: <IdolManagementIcon isActive={selectedKeys === Path.IDOL_MANAGEMENT} />,
      onClick: () => navigate(PATH.IDOL_MANAGEMENT._),
    },
  ];
};
