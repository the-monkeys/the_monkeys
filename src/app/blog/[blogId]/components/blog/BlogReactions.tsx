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
        <div className='flex items-center gap-1'>
          <button className='opacity-75 hover:opacity-100'>
            <Icon name='RiHeart3' />
          </button>

          <p className='font-jost text-sm opacity-75'>27</p>
        </div>

        <div className='flex items-center gap-1'>
          <button className='opacity-75 hover:opacity-100'>
            <Icon name='RiChat4' />
          </button>

          <p className='font-jost text-sm opacity-75'>3</p>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <button
          className='opacity-75 hover:opacity-100'
          onClick={() => copyToClipboard(blog_id || '')}
        >
          <Icon name='RiShareForward' type='Fill' />
        </button>

        <button className='opacity-75 hover:opacity-100'>
          <Icon name='RiMore' type='Fill' />
        </button>
      </div>
    </div>
  );
};
