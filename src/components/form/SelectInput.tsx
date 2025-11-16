import { Select, SelectProps } from 'antd';
import { VentidoleInput, CommonInputProps } from './FormItemTemplate';
import clsx from 'clsx';

export type SelectInputProps = {
  options: { value: string | number | boolean | object; label: React.ReactNode }[];
  classNameInput?: string;
} & SelectProps &
  CommonInputProps;

export const SelectInput = ({ formItemName, options, classNameInput, ...rest }: SelectInputProps) => {
  return (
    <VentidoleInput formItemName={formItemName} {...rest}>
      <Select
        className={clsx('h-10 w-full', classNameInput)}
        filterOption={(input, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        options={options}
        {...rest}
      />
    </VentidoleInput>
  );
};
