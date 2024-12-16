import Icon from '@/components/icon';

export const CommentButton = ({
  blogId,
  isDisable = false,
}: {
  blogId?: string;
  isDisable?: boolean;
}) => {
  return (
    <button
      className={`group p-1 flex items-center justify-center opacity-100 hover:opacity-80 ${
        isDisable ? 'cursor-default' : 'cursor-pointer'
      }`}
      disabled={isDisable}
    >
      <Icon name='RiChat1' size={18} />
    </button>
  );
};
