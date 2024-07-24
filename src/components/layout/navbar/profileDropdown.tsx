import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { signOut, useSession } from 'next-auth/react';

const ProfileDropdown = () => {
  const { status, data } = useSession();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='hover:opacity-75 cursor-pointer'>
          <Icon name='RiUser' size={24} />
        </div>
      </DropdownMenuTrigger>

      {status === 'unauthenticated' ? (
        <DropdownMenuContent className='m-2 w-44'>
          <DropdownMenuItem>
            <div
              onClick={() => {
                router.push('api/auth/signin');
              }}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiLoginBox' className='text-alert-green' />
              <p className='font-josefin_Sans text-base'>Login</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className='m-2 w-44'>
          <DropdownMenuItem asChild>
            <Link
              href={`/${data?.user?.username}`}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiUser' />
              <p className='font-josefin_Sans text-base'>Profile</p>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href='/settings' className='flex w-full items-center gap-2'>
              <Icon name='RiSettings3' />
              <p className='font-josefin_Sans text-base'>Settings</p>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/activity?user=${data?.user?.username}`}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiHistory' />
              <p className='font-josefin_Sans text-base'>Activity</p>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <div
              onClick={() => {
                signOut();
                toast({
                  variant: 'success',
                  title: ' Logout Successful',
                  description:
                    'You have successfully logged out. See you next time!',
                });
              }}
              className='flex w-full items-center gap-2'
            >
              <Icon name='RiLogoutBoxR' className='text-alert-red' />
              <p className='font-josefin_Sans text-base'>Logout</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default ProfileDropdown;
