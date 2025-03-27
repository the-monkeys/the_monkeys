import { useGetLikesCount } from '@/hooks/user/useLikeStatus';

export const LikesCount = ({ blogId }: { blogId?: string }) => {
  const { likes, likeCountLoading, likeCountError } = useGetLikesCount(blogId);

  if (likeCountLoading || likeCountError) return null;

  return (
    <p className='font-dm_sans text-sm opacity-80'>
      <span className='mr-[6px]'>·</span>
      {likes?.count ? likes?.count : '0'} likes
    </p>
  );
};
