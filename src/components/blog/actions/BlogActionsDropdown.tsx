import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

import { DeleteBlogDialog } from './DeleteBlogDialog';

export const BlogActionsDropdown = ({
  blogId,
  editEnable = false,
}: {
  blogId?: string;
  editEnable?: boolean;
}) => {
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`https://themonkeys.live/blog/${blogId}`)
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100'>
          <Icon name='RiMore' type='Fill' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-40'>
        <DropdownMenuItem asChild>
          <button
            onClick={copyToClipboard}
            className='flex w-full items-center gap-2'
          >
            <Icon name='RiFileCopy' />
            <p className='font-jost text-base'>Copy Link</p>
          </button>
        </DropdownMenuItem>

        {editEnable && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DeleteBlogDialog blogId={blogId} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
