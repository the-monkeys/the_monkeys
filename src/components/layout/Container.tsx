import { twMerge } from 'tailwind-merge';

const Container = (props: React.HTMLProps<HTMLDivElement>) => {
  const { children, className, ...rest } = props;

  return (
    <div className={twMerge('mx-auto max-w-7xl', className)} {...rest}>
      {children}
    </div>
  );
};

export default Container;
