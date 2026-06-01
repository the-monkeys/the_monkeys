'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Icon from '@/components/icon';
import {
  useDeleteEventPhoto,
  useEventPhotos,
  useUploadEventPhoto,
} from '@/hooks/events/useEventQueries';
import { eventError } from '@/services/events/eventsApi';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

const MAX_PHOTOS = 4;
// Mirror the storage service's practical ceiling. Larger files upload fine but
// skip server-side blurhash/dimension extraction, so we reject early to keep
// the gallery snappy and give the host immediate feedback.
const MAX_BYTES = 10 * 1024 * 1024;

export function EventGallery({
  slug,
  canManage,
}: {
  slug: string;
  canManage?: boolean;
}) {
  const { toast } = useToast();
  const { data: photos = [], isLoading } = useEventPhotos(slug);
  const upload = useUploadEventPhoto(slug);
  const remove = useDeleteEventPhoto(slug);

  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const count = photos.length;
  const atCap = count >= MAX_PHOTOS;

  // Auto-slide every 15 seconds
  useEffect(() => {
    if (isHovered || count < 2) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If we reached the end, loop back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const itemWidth =
            (scrollRef.current.firstChild as HTMLElement)?.clientWidth || 0;
          scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [count, isHovered]);

  const goLeft = () => {
    if (scrollRef.current) {
      const itemWidth =
        (scrollRef.current.firstChild as HTMLElement)?.clientWidth || 0;
      scrollRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  };

  const goRight = () => {
    if (scrollRef.current) {
      const itemWidth =
        (scrollRef.current.firstChild as HTMLElement)?.clientWidth || 0;
      scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  };

  const onPick = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please choose an image file' });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: 'Image is too large', description: 'Max size is 10 MB.' });
      return;
    }
    if (atCap) {
      toast({ title: `You can add up to ${MAX_PHOTOS} photos` });
      return;
    }

    try {
      await upload.mutateAsync(file);
      toast({ title: 'Photo added' });
      // Scroll to the end to show the new photo
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: scrollRef.current.scrollWidth,
            behavior: 'smooth',
          });
        }
      }, 100);
    } catch (err) {
      toast({ title: 'Upload failed', description: eventError(err) });
    }
  };

  const onDelete = async (photoId: string) => {
    try {
      await remove.mutateAsync(photoId);
      toast({ title: 'Photo removed' });
    } catch (err) {
      toast({ title: 'Could not remove photo', description: eventError(err) });
    }
  };

  return (
    <section aria-labelledby='event-gallery-heading'>
      <div className='flex items-center justify-between gap-3'>
        <h2
          id='event-gallery-heading'
          className='font-newsreader font-bold text-2xl md:text-3xl'
        >
          Photos
        </h2>

        {canManage && count > 0 && (
          <Button
            type='button'
            variant='outline'
            className='h-11 gap-2'
            onClick={onPick}
            disabled={atCap || upload.isPending}
          >
            <Icon name='RiAdd' size={18} />
            {atCap ? 'Gallery full' : `Add (${count}/${MAX_PHOTOS})`}
          </Button>
        )}
      </div>

      {canManage && (
        <input
          ref={fileRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={onFile}
        />
      )}

      {isLoading ? (
        <div className='mt-4 flex gap-4 overflow-hidden'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='aspect-[3/4] w-full min-w-[280px] flex-shrink-0 animate-pulse rounded-2xl bg-foreground-light/40 sm:min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-10.66px)] dark:bg-foreground-dark/30'
            />
          ))}
        </div>
      ) : count > 0 ? (
        <div
          className='relative mt-4 group'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className='flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          >
            {photos.map((p) => (
              <div
                key={p.id}
                className='relative aspect-[3/4] w-full min-w-[280px] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-foreground-light/40 sm:min-w-[calc(50%-8px)] md:min-w-[calc(33.333%-10.66px)] dark:bg-foreground-dark/30'
              >
                <img
                  src={p.url}
                  alt='Event gallery photo'
                  loading='lazy'
                  className='h-full w-full object-cover'
                />

                {canManage && (
                  <button
                    type='button'
                    aria-label='Remove photo'
                    onClick={() => onDelete(p.id)}
                    disabled={remove.isPending}
                    className='absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:opacity-50'
                  >
                    <Icon name='RiDeleteBin6' size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Visible if more photos than fit) */}
          {count > 1 && (
            <>
              <button
                type='button'
                aria-label='Previous photo'
                onClick={goLeft}
                className='absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-900 opacity-0 shadow-sm transition-all hover:bg-white group-hover:opacity-100 dark:bg-black/60 dark:text-white dark:hover:bg-black/80'
              >
                <Icon name='RiArrowLeftS' size={22} />
              </button>
              <button
                type='button'
                aria-label='Next photo'
                onClick={goRight}
                className='absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-900 opacity-0 shadow-sm transition-all hover:bg-white group-hover:opacity-100 dark:bg-black/60 dark:text-white dark:hover:bg-black/80'
              >
                <Icon name='RiArrowRightS' size={22} />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className='mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light py-12 text-center dark:border-border-dark/60'>
          <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <Icon name='RiCameraLens' size={26} />
          </div>
          <p className='font-dm_sans font-medium'>No photos for now!</p>
          <p className='mt-1 font-inter text-sm text-gray-500 dark:text-gray-400'>
            {canManage
              ? 'Add up to four photos to bring this event to life.'
              : 'Photos shared by the hosts will appear here.'}
          </p>
          {canManage && (
            <Button
              type='button'
              variant='brand'
              className='mt-4 h-11 gap-2'
              onClick={onPick}
              disabled={upload.isPending}
            >
              <Icon name='RiUpload2' size={18} />
              {upload.isPending ? 'Uploading…' : 'Add photos'}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
