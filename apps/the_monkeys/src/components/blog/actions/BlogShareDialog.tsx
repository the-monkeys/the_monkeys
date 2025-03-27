import React, { FC } from 'react';

import {
  ShareButton,
  ShareButtonContainer,
} from '@/components/buttons/shareButton';
import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

interface BlogShareDialogProps {
  blogURL: string;
  size?: number;
}

export const BlogShareDialog: FC<BlogShareDialogProps> = ({
  blogURL,
  size = 18,
}) => {
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${blogURL}`).then(
        () => {
          toast({
            variant: 'default',
            title: 'Blog Link Copied',
            description: 'The blog link has been copied.',
          });
        },
        () => {
          toast({
            variant: 'error',
            title: 'Copy Failed',
            description: 'Unable to copy the blog link.',
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
          title='Share Blog'
        >
          <Icon name='RiShareForward' size={size} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to Read</DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
        </DialogHeader>

        <div className='pb-3 flex items-center justify-evenly gap-4 flex-wrap'>
          <ShareButtonContainer label='Facebook'>
            <ShareButton type='Facebook' url={blogURL} />
          </ShareButtonContainer>

          <ShareButtonContainer label='X'>
            <ShareButton type='X' url={blogURL} />
          </ShareButtonContainer>

          <ShareButtonContainer label='LinkedIn'>
            <ShareButton type='LinkedIn' url={blogURL} />
          </ShareButtonContainer>

          <ShareButtonContainer label='WhatsApp'>
            <ShareButton type='WhatsApp' url={blogURL} />
          </ShareButtonContainer>
        </div>

        <div className='p-2 flex items-center gap-1 rounded-full border-1 border-foreground-light dark:border-foreground-dark overflow-hidden'>
          <div className='pl-2 flex-1 overflow-hidden'>
            <p className='text-sm truncate opacity-80'>{blogURL}</p>
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
