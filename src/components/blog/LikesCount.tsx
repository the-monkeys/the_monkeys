import { useGetLikesCount } from '@/hooks/user/useLikeStatus';

export const LikesCount = ({ blogId }: { blogId?: string }) => {
  const { likes, likeCountLoading, likeCountError } = useGetLikesCount(blogId);

  if (likeCountError || likeCountLoading) return null;

  if (!likes?.count) return null;

  return (
    <p className='font-dm_sans text-xs'>
      <span className='mr-[6px]'>·</span>
      {likes?.count}{' '}
      <span className='opacity-80'>
        {(likes?.count as number) > 1 ? 'likes' : 'like'}
      </span>
    </p>
  );
};
