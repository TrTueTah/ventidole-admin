import { Form } from 'antd';
import clsx from 'clsx';
import useResize from '@/hooks/useResize';
import { Rule } from 'antd/es/form';

export type CommonInputProps = {
  label?: React.ReactNode;
  formItemName?: any;
  classNameForm?: string;
  hidden?: boolean;
  isVerticalLabel?: boolean;
  rules?: Rule[];
  isHideRequired?: boolean;
};

export const VentidoleInput = <T extends object>({
  label,
  formItemName,
  classNameForm,
  hidden,
  isVerticalLabel = false,
  children,
  rules,
  isHideRequired,
}: React.PropsWithChildren<CommonInputProps>) => {
  const { isMobile } = useResize();
  return (
    <Form.Item<T>
      name={formItemName}
      rules={rules}
      className={clsx('mb-0', classNameForm, {
        'ventidole-label-vertical': isVerticalLabel || isMobile,
        'ventidole-label-hide-required': isHideRequired,
      })}
      hidden={hidden}
      label={label}
      labelCol={{ span: isVerticalLabel || isMobile ? 24 : '' }}>
      {children}
    </Form.Item>
  );
};
