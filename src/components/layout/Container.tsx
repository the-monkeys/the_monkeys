import { cn } from '@/lib/utils';

const Container = (props: React.HTMLProps<HTMLDivElement>) => {
  const { children, className, ...rest } = props;

  return (
    <div className={cn('mx-auto max-w-7xl', className)} {...rest}>
      {children}
    </div>
  );
};

export default Container;
