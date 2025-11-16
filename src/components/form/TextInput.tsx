import { Input, InputProps } from 'antd';
import { VentidoleInput, CommonInputProps } from './FormItemTemplate';
import clsx from 'clsx';

export type TextInputProps = {
  isHideRequired?: boolean;
  classNameInput?: string;
} & InputProps &
  CommonInputProps;

export const TextInput = ({ formItemName, classNameInput, onChange, ...rest }: TextInputProps) => {
  return (
    <VentidoleInput formItemName={formItemName} {...rest}>
      <Input
        className={clsx('h-10 w-full px-4 ventidole-input-form', classNameInput)}
        autoComplete='new-password'
        onChange={onChange}
        allowClear
        {...rest}
      />
    </VentidoleInput>
  );
};
