import { useGetLikesCount } from '@/hooks/user/useLikeStatus';

export const LikesCount = ({
  blogId,
  showSeparator = false,
}: {
  blogId?: string;
  showSeparator?: boolean;
}) => {
  const { likes, likeCountLoading, likeCountError } = useGetLikesCount(blogId);

  if (likeCountError || likeCountLoading) return null;

  if (!likes?.count) return null;

  return (
    <p className='text-sm opacity-80'>
      {showSeparator && <span className='mr-[6px]'>·</span>}
      {likes?.count} {(likes?.count as number) > 1 ? 'likes' : 'like'}
    </p>
  );
};
