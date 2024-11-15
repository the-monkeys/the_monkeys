import Icon from '@/components/icon';
import { toast } from '@/components/ui/use-toast';
import { twMerge } from 'tailwind-merge';

export const BlogReactions = ({
  className,
  blog_id,
}: {
  className?: string;
  blog_id?: string;
}) => {
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`https://themonkeys.live/blog/${text}`)
        .then(
          () => {
            toast({
              variant: 'default',
              title: 'Blog Link Copied',
              description: 'The blog link has been copied.',
            });
          },
          () => {
            toast({
              variant: 'error',
              title: 'Copy Failed',
              description: 'Unable to copy the blog link.',
            });
          }
        );
    }
  };

  return (
    <div
      className={twMerge(
        className,
        'py-4 flex justify-between items-center gap-3'
      )}
    >
      <div className='flex items-center gap-3'>
        <button className='group flex items-center gap-1'>
          <Icon
            name='RiHeart3'
            className='opacity-75 group-hover:opacity-100'
          />
          <span className='font-jost text-sm opacity-75'>27</span>
        </button>

        <button className='group flex items-center gap-1'>
          <Icon name='RiChat1' className='opacity-75 group-hover:opacity-100' />
          <span className='font-jost text-sm opacity-75'>- -</span>
        </button>
      </div>

      <div className='flex items-center gap-3'>
        <button
          className='group'
          onClick={() => copyToClipboard(blog_id || '')}
        >
          <Icon
            name='RiShareForward'
            className='opacity-75 group-hover:opacity-100'
          />
        </button>

        <button className='group'>
          <Icon name='RiMore' className='opacity-75 group-hover:opacity-100' />
        </button>
      </div>
    </div>
  );
};
