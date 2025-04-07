import Icon from '@/components/icon';

export const CommentButton = ({
  blogId,
  size = 18,
  isDisable = false,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
}) => {
  return (
    <button
      className={`group p-1 flex items-center justify-center opacity-100 hover:opacity-80 ${
        isDisable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      disabled={isDisable}
    >
      <Icon name='RiChat1' size={size} />
    </button>
  );
};
