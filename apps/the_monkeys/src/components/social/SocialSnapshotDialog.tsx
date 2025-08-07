import { useState } from 'react';

import { Blog } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { twMerge } from 'tailwind-merge';

import { getCardContent } from '../blog/getBlogContent';
import { SnapshotCanvas } from './SnapshotCanvas';

export const SocialSnapshotDialog = ({ blog }: { blog: Blog }) => {
  const [selectedImage, setSelectedImage] = useState<string>('');

  const { titleContent } = getCardContent({ blog });
  const sanitizedTitle = purifyHTMLString(titleContent);

  const images = blog?.blog?.blocks
    .filter((block) => block.type === 'image' && block.data.file.url)
    .map((block) => {
      if (selectedImage === '') setSelectedImage(block.data.file.url);
      return block.data.file.url;
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='brand'
          className='rounded-none'
          title='Create Snapshot'
        >
          Create Snapshot
        </Button>
      </DialogTrigger>

      <DialogContent className='!max-w-lg h-fit max-h-[75vh] sm:max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Social Snapshot</DialogTitle>
          <DialogDescription>
            Turn posts into a shareable snapshot you can download.
          </DialogDescription>
        </DialogHeader>

        <div className='pt-4 flex flex-col items-center gap-4'>
          <div className='flex gap-3 flex-wrap'>
            {images.length ? (
              images.map((image, index) => {
                return (
                  <div
                    className={twMerge(
                      'shrink-0 h-[60px] w-[80px] overflow-hidden ring-2 cursor-pointer hover:opacity-100',
                      selectedImage === image
                        ? 'opacity-100 ring-brand-orange'
                        : 'opacity-90 border-ring-light dark:ring-border-dark'
                    )}
                    key={index}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} className='w-full h-full object-cover' />
                  </div>
                );
              })
            ) : (
              <p className='p-2 text-sm opacity-90'>
                No image available. Using default background.
              </p>
            )}
          </div>

          <div className='flex-1'>
            <SnapshotCanvas title={titleContent} imageURL={selectedImage} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
