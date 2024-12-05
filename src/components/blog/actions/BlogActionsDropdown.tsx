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
  modificationEnable = false,
  isShareable = true,
}: {
  blogId?: string;
  modificationEnable?: boolean;
  isShareable?: boolean;
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
        <button className='p-1 flex items-center justify-center cursor-pointer opacity-100 hover:opacity-80'>
          <Icon name='RiMore' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='mx-2 w-36 sm:w-40'>
        {isShareable && (
          <DropdownMenuItem asChild>
            <button
              onClick={copyToClipboard}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiShareForward' />
              <p className='font-roboto text-sm sm:text-base'>Share Blog</p>
            </button>
          </DropdownMenuItem>
        )}

        {modificationEnable ? (
          <>
            {isShareable && <DropdownMenuSeparator />}

            <DropdownMenuItem asChild>
              <DeleteBlogDialog blogId={blogId} />
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
