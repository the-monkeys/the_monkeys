'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

import Icon from '@/components/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

import EditDialog from './EditDialog';
import ProfileCard from './ProfileCard';

const ProfileSection = () => {
  const params = useParams<{ username: string }>();

  const { data, status } = useSession();

  useEffect(() => {
    // console.log(data);
  }, [status]);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://themonkeys.live/${text}`).then(
        () => {
          toast({
            variant: 'default',
            title: 'Profile Link Copied',
            description: 'The profile link has been copied to the clipboard.',
          });
        },
        () => {
          toast({
            variant: 'error',
            title: 'Copy Failed',
            description: 'Unable to copy the profile link.',
          });
        }
      );
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-4 justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='hover:opacity-75 cursor-pointer'>
              <Icon name='RiShareForward' size={24} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='m-2'>
            <DropdownMenuItem>
              <div
                className='flex w-full items-center gap-2'
                onClick={() => copyToClipboard(data?.user.username || '')}
              >
                <Icon name='RiFileCopy' />

                <p className='font-josefin_Sans text-base'>Copy Link</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='hover:opacity-75 cursor-pointer'>
              <Icon name='RiMore' size={24} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='m-2'>
            {data?.user.username === params.username &&
            status === 'authenticated' ? (
              <>
                <EditDialog />

                <DropdownMenuSeparator />
              </>
            ) : (
              ''
            )}

            <DropdownMenuItem>
              <div className='flex w-full items-center gap-2'>
                <Icon name='RiErrorWarning' className='text-alert-red' />

                <p className='font-josefin_Sans text-base'>Report Profile</p>
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
