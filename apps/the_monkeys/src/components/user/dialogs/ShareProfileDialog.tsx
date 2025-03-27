import React, { FC } from 'react';

import {
  ShareButton,
  ShareButtonContainer,
} from '@/components/buttons/shareButton';
import Icon from '@/components/icon';
import { LIVE_URL } from '@/constants/api';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

interface ShareProfileDialogProps {
  username: string;
  size?: number;
}

export const ShareProfileDialog: FC<ShareProfileDialogProps> = ({
  username,
  size = 18,
}) => {
  const profileURL = `${LIVE_URL}/${username}`;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileURL).then(
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
    <Dialog>
      <DialogTrigger asChild>
        <button
          className='p-1 flex items-center justify-center cursor-pointer hover:opacity-80'
          title='Share Profile'
        >
          <Icon name='RiShareForward' size={size} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Showcase your Profile</DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
        </DialogHeader>

        <div className='pb-3 flex items-center justify-evenly gap-4 flex-wrap'>
          <ShareButtonContainer label='Facebook'>
            <ShareButton type='Facebook' url={profileURL} />
          </ShareButtonContainer>

          <ShareButtonContainer label='X'>
            <ShareButton type='X' url={profileURL} />
          </ShareButtonContainer>

          <ShareButtonContainer label='LinkedIn'>
            <ShareButton type='LinkedIn' url={profileURL} />
          </ShareButtonContainer>

          <ShareButtonContainer label='WhatsApp'>
            <ShareButton type='WhatsApp' url={profileURL} />
          </ShareButtonContainer>
        </div>

        <div className='p-2 flex items-center gap-1 rounded-full border-1 border-foreground-light dark:border-foreground-dark overflow-hidden'>
          <div className='pl-2 flex-1 overflow-hidden'>
            <p className='text-sm truncate opacity-80'>{profileURL}</p>
          </div>

          <Button
            variant='secondary'
            size='sm'
            className='rounded-full'
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
