import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { logOut } from '@/app/action';
import { useSession } from '@/app/session-store-provider';
import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileDropdown = () => {
  const { status, data } = useSession();
  const router = useRouter();

  const handleSignout = async () => {
    await logOut();
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
                if (window.location.pathname === '/login') {
                  window.location.reload();
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
              href={`/${data?.user?.username}`}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiUser' size={18} />
              <p className='font-dm_sans text-sm sm:text-base'>Profile</p>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href='/library?source=bookmarks'
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
              href={`/activity?user=${data?.user?.username}`}
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
