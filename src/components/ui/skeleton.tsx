import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg bg-secondary-darkGrey/15 dark:bg-secondary-white/15 animate-opacity-pulse',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
