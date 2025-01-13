export const ReactionsInfo = ({
  likesCount,
  bookmarksCount,
}: {
  likesCount?: number;
  bookmarksCount?: number;
}) => {
  return (
    <div className='flex gap-2'>
      <div className='flex items-center gap-1'>
        <p className='text-sm'>
          {likesCount || '0'}{' '}
          <span className='opacity-80'>
            {likesCount !== 1 ? 'likes' : 'like'}
          </span>
        </p>
      </div>

      <div className='flex items-center gap-1'>
        <p className='text-sm'>
          {bookmarksCount || '0'}{' '}
          <span className='opacity-80'>
            {bookmarksCount !== 1 ? 'saves' : 'save'}
          </span>
        </p>
      </div>
    </div>
  );
};
