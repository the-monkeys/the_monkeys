'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

import { ConnectionsDialog } from './ConnectionsDialog';
import { EditDialog } from './EditDialog';
import { FollowButton } from './FollowButton';
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
        {data?.user.username === params.username &&
          status === 'authenticated' && <ConnectionsDialog />}

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
            <FollowButton username={params.username} />
          )}
      </div>

      <ProfileCard />

      <Separator className='my-4' />

      <TopicsCard />
    </div>
  );
};
