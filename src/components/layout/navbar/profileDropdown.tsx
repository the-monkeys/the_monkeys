'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ACTIVITY_ROUTE, LIBRARY_ROUTE } from '@/constants/routeConstants';
import axiosInstance from '@/services/api/axiosInstance';
import { IUser } from '@/services/models/user';
import { useQueryClient } from '@tanstack/react-query';

const ProfileDropdown = ({ session }: { session?: IUser }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignout = async () => {
    await axiosInstance.get('/auth/logout');

    queryClient.resetQueries({ queryKey: ['auth'] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='hover:opacity-80 cursor-pointer'>
          <ProfileFrame className='size-[22px] ring-1 ring-foreground-light/50 dark:ring-foreground-dark/50'>
            <ProfileImage username={session?.username} />
          </ProfileFrame>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='mt-3 mr-2 w-[200px] sm:w-[220px] space-y-1'>
        {!session ? (
          <DropdownMenuItem asChild>
            <button
              onClick={() => {
                const currentPath = window.location.pathname;

                if (currentPath === '/login') {
                  window.location.reload();
                  return;
                }

                if (currentPath.startsWith('/blog/')) {
                  router.push('/');
                  return;
                }

                router.push('/auth/login');
              }}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiLoginBox' size={18} className='text-alert-green' />
              <p className='font-dm_sans text-sm sm:text-base text-alert-green'>
                Login
              </p>
            </button>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link
                href={`/${session.username}`}
                className='flex items-center gap-2'
              >
                <ProfileFrame className='size-8 sm:size-10 shrink-0'>
                  <ProfileImage username={session?.username} />
                </ProfileFrame>

                <div className='flex-1 flex flex-col overflow-hidden'>
                  <p className='font-dm_sans font-medium text-base'>
                    {session.first_name} {session.last_name}
                  </p>
                  <p className='text-[13px] opacity-80 truncate'>
                    @{session.username}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href={`${LIBRARY_ROUTE}?source=bookmarks`}
                className='flex w-full items-center gap-2'
              >
                <Icon name='RiBookmark' size={18} />
                <p className='font-dm_sans text-sm sm:text-base'>Bookmarks</p>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href='/settings' className='flex w-full items-center gap-2'>
                <Icon name='RiSettings3' size={18} />
                <p className='font-dm_sans text-sm sm:text-base'>Settings</p>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`${ACTIVITY_ROUTE}?user=${session.username}`}
                className='flex w-full items-center gap-2'
              >
                <Icon name='RiHistory' size={18} />
                <p className='font-dm_sans text-sm sm:text-base'>Activity</p>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <button
                onClick={handleSignout}
                className='flex w-full items-center gap-2'
              >
                <Icon
                  name='RiLogoutBoxR'
                  size={18}
                  className='text-alert-red'
                />
                <p className='font-dm_sans text-sm sm:text-base text-alert-red'>
                  Logout
                </p>
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
