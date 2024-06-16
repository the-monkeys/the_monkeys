import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg bg-secondary-darkGrey/25 dark:bg-secondary-white/25 animate-pulse',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
