import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const BlogActionsDropdown = ({
  blogId,
  size = 18,
}: {
  blogId: string;
  size?: number;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 flex items-center justify-center cursor-pointer opacity-100 hover:opacity-80'>
          <Icon name='RiMore' size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-32 sm:w-36' align='end'>
        <DropdownMenuItem asChild>
          <button
            className='flex w-full items-center gap-2 opacity-80 cursor-not-allowed'
            disabled
          >
            <Icon
              name='RiErrorWarning'
              size={size}
              className='text-alert-red'
            />
            <p className='font-dm_sans text-sm sm:text-base text-alert-red'>
              Report Blog
            </p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
