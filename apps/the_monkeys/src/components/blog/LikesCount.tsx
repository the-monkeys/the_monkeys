import { useGetLikesCount } from '@/hooks/user/useLikeStatus';
import { formatCount } from '@/lib/utils';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

type Props = {
  blogId: string;
};

export const LikesCount = ({ blogId }: Props) => {
  const { likes, likeCountLoading, likeCountError } = useGetLikesCount(blogId);

  const count = likes?.count ?? 0;

  if (likeCountLoading) {
    return (
      <div
        className='flex items-center justify-center min-w-4'
        aria-label='Loading likes'
      >
        <Skeleton className='h-3 w-6 rounded-full' />
      </div>
    );
  }

  if (likeCountError) {
    return (
      <p
        className={`font-dm_sans text-sm tabular-nums min-w-4 text-center opacity-60`}
        aria-label='Likes unavailable'
      >
        0
      </p>
    );
  }

  return (
    <p
      className={`font-dm_sans text-sm tabular-nums min-w-4 text-center opacity-8`}
      aria-label={`${count} likes`}
    >
      {formatCount(count)}
    </p>
  );
};
