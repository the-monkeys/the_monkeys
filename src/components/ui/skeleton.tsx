import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-md bg-secondary-lightGrey/25 animate-opacity-pulse',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
