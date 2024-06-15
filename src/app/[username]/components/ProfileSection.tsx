'use client';

import { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';

import ProfileCard from './ProfileCard';

const ProfileSection = () => {
  const params = useParams<{ username: string }>();
  const { data, status } = useSession();
  // if (status === 'unauthenticated') {
  //   router.push('/login');
  // }
  useEffect(() => {
    // console.log(data);
  }, [status]);

  return (
    <div className='space-y-2'>
      <div className='flex gap-2 items-center justify-end'>
        {/* <Button size='icon'>
          <Icon name='RiShare' />
        </Button>
        {data?.user.user_name === params.username &&
        status === 'authenticated' ? (
          <Button size='icon'>
            <Icon name='RiEdit' />
          </Button>
        ) : (
          ''
        )} */}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='hover:text-primary-monkeyOrange cursor-pointer'>
              <Icon name='RiMore' size={24} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='m-2'>
            {data?.user.user_name === params.username &&
            status === 'authenticated' ? (
              <>
                <DropdownMenuItem>
                  <div className='flex w-full items-center gap-2'>
                    <Icon name='RiEdit' />

                    <p className='font-josefin_Sans text-base'>Edit</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>
            ) : (
              ''
            )}

            <DropdownMenuItem>
              <div className='flex w-full items-center gap-2'>
                <Icon name='RiShare' />

                <p className='font-josefin_Sans text-base'>Share </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <div className='flex w-full items-center gap-2'>
                <Icon name='RiErrorWarning' className='text-alert-red' />

                <p className='font-josefin_Sans text-base'>Report</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileCard />
    </div>
  );
};

export default ProfileSection;
