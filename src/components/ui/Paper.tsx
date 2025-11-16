import clsx from 'clsx';

type Props = {
  className?: string;
  children: React.ReactNode;
};

function VentidolePaper({ className, children }: Props) {
  return (
    <div className={clsx('bg-white border-ventidole-neutral-30 rounded-10 border border-solid p-4 md:p-8 w-full h-full', className)}>
      {children}
    </div>
  );
}

export default VentidolePaper;
