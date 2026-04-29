export function FeaturedAuthorStorySkeleton() {
  return (
    <div className='flex flex-col items-center gap-2 animate-pulse'>
      {/* Avatar Skeleton */}
      <div className='h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700' />

      {/* Name Skeleton */}
      <div className='h-3 w-16 rounded bg-gray-200 dark:bg-gray-700' />
    </div>
  );
}
