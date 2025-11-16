import { Popover } from 'antd';
import { JSX } from 'react';

type VentidolePopoverProps = {
  open: boolean;
  contentPopover: JSX.Element;
  children: JSX.Element;
  trigger?: 'hover' | 'click' | 'focus' | 'contextMenu';
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
  onOpenChange?: (open: boolean) => void;
};

export default function VentidolePopover({
  open,
  contentPopover,
  children,
  trigger = 'click',
  placement,
  onOpenChange,
}: VentidolePopoverProps) {
  return (
    <Popover
      content={contentPopover}
      trigger={trigger}
      open={open}
      arrow={false}
      placement={placement}
      onOpenChange={onOpenChange}>
      {children}
    </Popover>
  );
}
