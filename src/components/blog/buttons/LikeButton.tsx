import Icon from '@/components/icon';

export const LikeButton = ({ blogId }: { blogId?: string }) => {
  return (
    <button className='p-1 flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100'>
      <Icon name='RiHeart3' />
    </button>
  );
};
