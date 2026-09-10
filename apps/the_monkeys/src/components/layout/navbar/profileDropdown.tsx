'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { VerifiedBadge } from '@/components/user/VerifiedBadge';
import { LIBRARY_ROUTE } from '@/constants/routeConstants';
import useUser from '@/hooks/user/useUser';
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

function personName(session?: IUser) {
  const name = [session?.first_name, session?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || session?.username || 'Profile';
}

const ProfileDropdown = ({ session }: { session?: IUser }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { user } = useUser(session?.username);
  const displayName = personName(session);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [open]);

  const handleSignout = async () => {
    await axiosInstance.get('/auth/logout');
    sessionManager.endSession();

    queryClient.resetQueries({ queryKey: ['auth'] });
  };

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label='Open profile menu'
          className='hover:opacity-80 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange'
        >
          <ProfileFrame className='size-9 border-1 border-border-light/80 dark:border-border-dark/80'>
            <ProfileImage username={session?.username} />
          </ProfileFrame>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='mr-1 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl p-2'
      >
        <DropdownMenuItem className='rounded-xl p-2' asChild>
          <Link
            href={`/${session?.username}`}
            className='flex items-center gap-3'
          >
            <ProfileFrame className='size-11 shrink-0'>
              <ProfileImage username={session?.username} />
            </ProfileFrame>

            <div className='min-w-0 flex-1'>
              <p className='flex items-center gap-1 font-dm_sans font-medium text-base leading-snug'>
                <span className='min-w-0 break-words'>{displayName}</span>
                <VerifiedBadge
                  isVerified={user?.is_verified}
                  showText={false}
                  size={16}
                />
              </p>
              <p className='mt-0.5 font-inter text-[13px] text-brand-orange'>
                View profile →
              </p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href='/settings'
            className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3'
          >
            <Icon name='RiSettings3' size={18} className='shrink-0' />
            <p className='flex-1 font-dm_sans text-sm sm:text-base'>Settings</p>
            <Icon
              name='RiArrowRightS'
              size={16}
              className='shrink-0 opacity-50'
            />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={LIBRARY_ROUTE}
            className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3'
          >
            <Icon name='RiBookShelf' size={18} className='shrink-0' />
            <p className='flex-1 font-dm_sans text-sm sm:text-base'>Library</p>
            <Icon
              name='RiArrowRightS'
              size={16}
              className='shrink-0 opacity-50'
            />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <button
            type='button'
            onClick={handleSignout}
            className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3'
          >
            <Icon
              name='RiLogoutBoxR'
              size={18}
              className='shrink-0 text-brand-orange'
            />
            <p className='flex-1 text-left font-dm_sans text-sm sm:text-base text-brand-orange'>
              Logout
            </p>
            <Icon
              name='RiArrowRightS'
              size={16}
              className='shrink-0 text-brand-orange opacity-70'
            />
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
