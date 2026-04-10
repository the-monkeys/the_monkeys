'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import ThemeSwitch from '@/components/themeSwitch';
import { ACTIVITY_ROUTE, LIBRARY_ROUTE } from '@/constants/routeConstants';
import axiosInstance from '@/services/api/axiosInstance';
import { IUser } from '@/services/models/user';
import sessionManager from '@/utils/sessionManager';
import { useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';
import { Separator } from '@the-monkeys/ui/atoms/separator';

const ProfileDropdown = ({ session }: { session?: IUser }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignout = async () => {
    await axiosInstance.get('/auth/logout');
    sessionManager.endSession();

    queryClient.resetQueries({ queryKey: ['auth'] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='hover:opacity-80 cursor-pointer'>
          <ProfileFrame className='size-9 border-1 border-border-light/80 dark:border-border-dark/80'>
            <ProfileImage username={session?.username} />
          </ProfileFrame>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='mt-2 mr-2 w-[100px] sm:w-[180px]'>
        <DropdownMenuItem className='p-2' asChild>
          <Link
            href={`/${session?.username}`}
            className='flex items-center gap-2 overflow-hidden'
          >
            <ProfileFrame className='size-10 sm:size-12 shrink-0'>
              <ProfileImage username={session?.username} />
            </ProfileFrame>

            <div className='flex-1 flex flex-col overflow-hidden'>
              <p className='font-dm_sans font-medium text-base truncate'>
                {session?.first_name}{' '}
                {session?.last_name ? session?.last_name : ''}
              </p>
              <p className='text-[13px] opacity-80 truncate'>View profile</p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/settings' className='flex w-full items-center gap-2'>
            <Icon name='RiSettings3' size={18} />
            <p className='font-dm_sans text-sm sm:text-base'>Settings</p>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`${ACTIVITY_ROUTE}?user=${session?.username}`}
            className='flex w-full items-center gap-2'
          >
            <Icon name='RiHistory' size={18} />
            <p className='font-dm_sans text-sm sm:text-base'>Activity</p>
          </Link>
        </DropdownMenuItem>

        <Separator />

        <DropdownMenuItem asChild>
          <button
            onClick={handleSignout}
            className='flex w-full items-center gap-2'
          >
            <Icon name='RiLogoutBoxR' size={18} className='text-alert-red' />
            <p className='font-dm_sans text-sm sm:text-base text-alert-red'>
              Logout
            </p>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
