import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-sm bg-foreground-light dark:bg-foreground-dark animate-opacity-pulse',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
