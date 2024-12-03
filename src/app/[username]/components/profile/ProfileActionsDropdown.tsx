import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

export const ProfileActionsDropdown = ({ username }: { username: string }) => {
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://themonkeys.live/${username}`).then(
        () => {
          toast({
            variant: 'default',
            title: 'Profile Link Copied',
            description: 'The profile link has been copied.',
          });
        },
        () => {
          toast({
            variant: 'error',
            title: 'Copy Failed',
            description: 'Unable to copy the profile link.',
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

      <DropdownMenuContent className='mt-2 w-40'>
        <DropdownMenuItem asChild>
          <button
            onClick={copyToClipboard}
            className='flex w-full items-center gap-2'
          >
            <Icon name='RiShareForward' />
            <p className='font-roboto text-base'>Share</p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
