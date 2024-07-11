import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';

const NotificationDropdown = () => {
  const { status, data } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='hover:opacity-75 cursor-pointer'>
          <Icon name='RiNotification3' size={24} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='m-2 w-96'>
        <DropdownMenuLabel className='p-4 pb-2 font-josefin_Sans text-xl'>
          Notifications
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className='flex h-fit max-h-[500px] flex-col gap-2 overflow-auto px-4 py-2'>
          <p className='italic self-center py-10 text-center font-jost text-lg'>
            {status === 'unauthenticated'
              ? 'Login to see notifications.'
              : 'No notifications yet.'}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
