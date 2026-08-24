'use client';

import { useCallback, useRef, useState } from 'react';

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

/**
 * Event photo gallery rendered as an Instagram-style carousel (max four
 * photos). Hosts and co-hosts see inline add/remove controls; everyone else
 * sees a swipeable, arrow-navigable viewer. Reads are public; the mutations are
 * gated by the event host guard on the gateway, so a non-host who forces the
 * request still gets a 401.
 */
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
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const count = photos.length;
  const atCap = count >= MAX_PHOTOS;
  const current = Math.min(index, Math.max(count - 1, 0));

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      const wrapped = (next + count) % count;
      setIndex(wrapped);
    },
    [count]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > 40) go(current + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const onPick = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset immediately so re-selecting the same file re-triggers change.
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
      // Surface the newest photo, which lands at the end of the list.
      setIndex(count);
    } catch (err) {
      toast({ title: 'Upload failed', description: eventError(err) });
    }
  };

  const onDelete = async (photoId: string) => {
    try {
      await remove.mutateAsync(photoId);
      toast({ title: 'Photo removed' });
      setIndex((i) => Math.max(0, Math.min(i, count - 2)));
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
        <div
          className='mt-4 w-full max-w-md animate-pulse rounded-2xl bg-foreground-light/40 dark:bg-foreground-dark/30'
          style={{ aspectRatio: '1 / 1' }}
        />
      ) : count > 0 ? (
        <div className='mt-4'>
          <div
            className='relative w-full max-w-md overflow-hidden rounded-2xl bg-foreground-light/40 dark:bg-foreground-dark/30'
            style={{ aspectRatio: '1 / 1' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className='flex h-full w-full transition-transform duration-300 ease-out'
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {photos.map((p) => (
                <img
                  key={p.id}
                  src={p.url}
                  alt=''
                  loading='lazy'
                  className='h-full w-full shrink-0 object-cover'
                  style={{ flex: '0 0 100%' }}
                />
              ))}
            </div>

            {count > 1 && (
              <span className='absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 font-inter text-xs font-medium text-white'>
                {current + 1}/{count}
              </span>
            )}

            {canManage && (
              <button
                type='button'
                aria-label='Remove photo'
                onClick={() => onDelete(photos[current]!.id)}
                disabled={remove.isPending}
                className='absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 disabled:opacity-50'
              >
                <Icon name='RiDeleteBin6' size={18} />
              </button>
            )}

            {count > 1 && (
              <>
                <button
                  type='button'
                  aria-label='Previous photo'
                  onClick={() => go(current - 1)}
                  className='absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-900 shadow-sm transition-colors hover:bg-white dark:bg-black/60 dark:text-white dark:hover:bg-black/80'
                >
                  <Icon name='RiArrowLeftS' size={22} />
                </button>
                <button
                  type='button'
                  aria-label='Next photo'
                  onClick={() => go(current + 1)}
                  className='absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-900 shadow-sm transition-colors hover:bg-white dark:bg-black/60 dark:text-white dark:hover:bg-black/80'
                >
                  <Icon name='RiArrowRightS' size={22} />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <div className='mt-3 flex items-center justify-center gap-2'>
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type='button'
                  aria-label={`Go to photo ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={
                    'h-2 rounded-full transition-all ' +
                    (i === current
                      ? 'w-5 bg-brand-orange'
                      : 'w-2 bg-gray-300 dark:bg-gray-600')
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className='mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light dark:border-border-dark/60 py-12 text-center'>
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
