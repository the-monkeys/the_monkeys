import { twMerge } from 'tailwind-merge';

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={twMerge(className, 'mx-auto max-w-7xl')}>{children}</div>
  );
};

export default Container;
