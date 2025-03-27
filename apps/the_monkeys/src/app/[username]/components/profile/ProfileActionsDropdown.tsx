import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ProfileActionsDropdown = ({ username }: { username: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100'>
          <Icon name='RiMore' type='Fill' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='m-2 w-36 sm:w-40'>
        <DropdownMenuItem asChild>
          <button
            className='flex w-full items-center gap-2 opacity-80 cursor-not-allowed'
            disabled
          >
            <Icon name='RiErrorWarning' className='text-alert-red' />
            <p className='font-dm_sans text-sm sm:text-base text-alert-red'>
              Report Profile
            </p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
