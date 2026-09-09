'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { VerifiedBadge } from '@/components/user/VerifiedBadge';
import { LIBRARY_ROUTE } from '@/constants/routeConstants';
import useUser from '@/hooks/user/useUser';
import { formatPersonName } from '@/lib/personName';
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
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { user } = useUser(session?.username);

  const displayName = formatPersonName(
    session?.first_name,
    session?.last_name,
    session?.username ?? ''
  );

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    // Capture so inner scrollers (feed, topic bar) also dismiss the menu.
    window.addEventListener('scroll', close, true);
    document.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('scroll', close, true);
      document.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const handleSignout = async () => {
    await axiosInstance.get('/auth/logout');
    sessionManager.endSession();

    queryClient.resetQueries({ queryKey: ['auth'] });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger aria-label='Open profile menu'>
        <div className='hover:opacity-80 cursor-pointer'>
          <ProfileFrame className='size-9 border-1 border-border-light/80 dark:border-border-dark/80'>
            <ProfileImage username={session?.username} />
          </ProfileFrame>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='mt-2 mr-2 w-[min(calc(100vw-1.5rem),18rem)]'
      >
        <DropdownMenuItem className='p-2' asChild>
          <Link
            href={`/${session?.username}`}
            className='flex items-center gap-2 overflow-hidden'
          >
            <ProfileFrame className='size-10 sm:size-12 shrink-0'>
              <ProfileImage username={session?.username} />
            </ProfileFrame>

            <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
              <div className='flex min-w-0 items-center gap-1'>
                <p className='min-w-0 truncate font-dm_sans font-medium text-base'>
                  {displayName}
                </p>
                <VerifiedBadge
                  isVerified={user?.is_verified === true}
                  showText={false}
                  size={16}
                  className='shrink-0'
                />
              </div>
              <p className='text-[13px] opacity-80'>View profile</p>
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
          <Link href={LIBRARY_ROUTE} className='flex w-full items-center gap-2'>
            <Icon name='RiBookShelf' size={18} />
            <p className='font-dm_sans text-sm sm:text-base'>Library</p>
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
