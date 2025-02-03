'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useSession } from '@/app/session-store-provider';
import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { ACTIVITY_ROUTE, LIBRARY_ROUTE } from '@/constants/routeConstants';
import axiosInstance from '@/services/api/axiosInstance';

const ProfileDropdown = () => {
  const { status, data, update } = useSession();
  const router = useRouter();

  const handleSignout = async () => {
    axiosInstance.get('/auth/logout');

    update({ status: 'unauthenticated', data: null });
    router.replace('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='hover:opacity-80 cursor-pointer'>
          <Icon name='RiUser' size={22} />
        </div>
      </DropdownMenuTrigger>

      {status === 'unauthenticated' ? (
        <DropdownMenuContent className='mt-3 mr-2 w-36 sm:w-44'>
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

                router.push('auth/login');
              }}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiLoginBox' size={18} className='text-alert-green' />
              <p className='font-dm_sans text-sm sm:text-base text-alert-green'>
                Login
              </p>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className='mt-3 mr-2 w-36 sm:w-44 space-y-1'>
          <DropdownMenuItem asChild>
            <Link
              href={`/${data?.user.username}`}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiUser' size={18} />
              <p className='flex-1 font-dm_sans text-sm sm:text-base truncate'>
                {session?.user
                  ? `${session.user.first_name} ${session.user.last_name}`
                  : 'Profile'}
              </p>
            </Link>
          </DropdownMenuItem>

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
              href={`${ACTIVITY_ROUTE}?user=${session?.user?.username}`}
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
              <Icon name='RiLogoutBoxR' size={18} className='text-alert-red' />
              <p className='font-dm_sans text-sm sm:text-base text-alert-red'>
                Logout
              </p>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default ProfileDropdown;
