import React, { FC } from 'react';

import {
  ShareButton,
  ShareButtonContainer,
} from '@/components/buttons/shareButton';
import Icon from '@/components/icon';
import { cn } from '@/lib/utils';
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

interface BlogShareDialogProps {
  blogURL: string;
  size?: number;
  triggerTitle?: string;
  dialogTitle?: string;
  copiedTitle?: string;
  copiedDescription?: string;
  triggerClassName?: string;
  triggerLabel?: string;
}

export const BlogShareDialog: FC<BlogShareDialogProps> = ({
  blogURL,
  size = 18,
  triggerTitle = 'Share Blog',
  dialogTitle = 'Invite to Read',
  copiedTitle = 'Blog Link Copied',
  copiedDescription = 'The link to this post has been copied.',
  triggerClassName,
  triggerLabel,
}) => {
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${blogURL}`).then(
        () => {
          toast({
            variant: 'default',
            title: copiedTitle,
            description: copiedDescription,
          });
        },
        () => {
          toast({
            variant: 'error',
            title: 'Copy Failed',
            description: 'Unable to copy the link.',
          });
        }
      );
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label={triggerTitle}
          title={triggerTitle}
          type='button'
          className={cn(
            'p-1 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100 transition-colors',
            triggerClassName
          )}
        >
          <Icon name='RiShare' size={size} />
          {triggerLabel ? <span>{triggerLabel}</span> : null}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
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
