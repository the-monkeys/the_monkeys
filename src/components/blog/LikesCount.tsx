import { useGetLikesCount } from '@/hooks/user/useLikeStatus';

export const LikesCount = ({ blogId }: { blogId?: string }) => {
  const { likes, likeCountLoading, likeCountError } = useGetLikesCount(blogId);

  if (likeCountError || likeCountLoading) return null;

  return (
    <p className='font-roboto text-xs opacity-80'>
      <span className='font-bold mr-[6px]'>·</span>
      {likes?.count} {(likes?.count as number) > 1 ? 'likes' : 'like'}
    </p>
  );
};
