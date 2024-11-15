'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

import { EditDialog } from './EditDialog';
import { ProfileCard } from './ProfileCard';
import { TopicsCard } from './TopicsCard';

export const ProfileSection = () => {
  const params = useParams<{ username: string }>();

  const { data, status } = useSession();

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://themonkeys.live/${text}`).then(
        () => {
          toast({
            variant: 'default',
            title: 'Profile Link Copied',
            description: 'The profile link has been copied.',
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
    <div>
      <div className='mb-2 flex gap-2 items-center justify-end'>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full'
          onClick={() => copyToClipboard(data?.user.username || '')}
        >
          <Icon name='RiShareForward' />
        </Button>

        {data?.user.username === params.username &&
          status === 'authenticated' && <EditDialog />}

        {data?.user.username !== params.username &&
          status === 'authenticated' && (
            <Button variant='outline' className='rounded-full'>
              <Icon name='RiUserAdd' size={18} className='mr-2' />
              <p>Follow</p>
            </Button>
          )}
      </div>

      <ProfileCard />

      <Separator className='my-4' />

      <TopicsCard />
    </div>
  );
};
