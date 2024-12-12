import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { LIVE_URL } from '@/constants/api';

export const BlogActionsDropdown = ({ blogId }: { blogId?: string }) => {
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${LIVE_URL}/blog/${blogId}`).then(
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 flex items-center justify-center cursor-pointer opacity-100 hover:opacity-80'>
          <Icon name='RiMore' size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='mx-2 w-32 sm:w-36'>
        <DropdownMenuItem asChild>
          <button
            onClick={copyToClipboard}
            className='flex w-full items-center gap-2'
          >
            <Icon name='RiClipboard' size={18} />
            <p className='font-dm_sans text-sm sm:text-base'>Copy Link</p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
