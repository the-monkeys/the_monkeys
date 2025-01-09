import React, { FC } from 'react';

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
import { toast } from '@/components/ui/use-toast';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

interface SocialMediaSharePopupProps {
  blogURL: string;
}
const SocialMediaSharePopup: FC<SocialMediaSharePopupProps> = ({ blogURL }) => {
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
      <DialogTrigger>
        <Icon name='RiShareForward' size={22} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share On</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className='py-2 flex items-center justify-center gap-4'>
          <Button
            variant={'secondary'}
            size={'icon'}
            className='rounded-full hover:opacity-80 size-12'
            onClick={copyToClipboard}
          >
            <Icon name='RiClipboard' size={18} />
          </Button>
          <Button
            variant={'secondary'}
            size={'icon'}
            className='rounded-full hover:opacity-80 size-12'
          >
            <FacebookShareButton url={blogURL}>
              <Icon name='RiMeta' size={24} />
            </FacebookShareButton>
          </Button>

          <Button
            variant={'secondary'}
            size={'icon'}
            className='rounded-full hover:opacity-80 size-12'
          >
            <TwitterShareButton url={blogURL}>
              <Icon name='RiTwitterX' size={24} />
            </TwitterShareButton>
          </Button>

          <Button
            variant={'secondary'}
            size={'icon'}
            className='rounded-full hover:opacity-80 size-12'
          >
            <LinkedinShareButton url={blogURL}>
              <Icon name='RiLinkedin' size={24} />
            </LinkedinShareButton>
          </Button>

          <Button
            variant={'secondary'}
            size={'icon'}
            className='rounded-full hover:opacity-80 size-12'
          >
            <WhatsappShareButton url={blogURL}>
              <Icon name='RiWhatsapp' size={24} />
            </WhatsappShareButton>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialMediaSharePopup;
