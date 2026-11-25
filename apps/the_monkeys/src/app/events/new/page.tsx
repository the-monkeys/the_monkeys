'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/buttons/backButton';
import { EventForm } from '@/components/events/EventForm';
import { EventGalleryPreview } from '@/components/events/detail/EventGallery';
import { EVENTS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { invalidateAfterEventWrite } from '@/lib/queryFreshness';
import { EventBody } from '@/services/events/eventTypes';
import {
  createEvent,
  createSeries,
  eventError,
  updateEvent,
  uploadEventCover,
  uploadEventPhoto,
} from '@/services/events/eventsApi';
import { getQueryClient } from '@/utils/get-query-client';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export default function NewEventPage() {
  const { data: session, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [galleryPreviewFiles, setGalleryPreviewFiles] = useState<File[]>([]);
  const previewOnly = process.env.NODE_ENV === 'development' && !session;

  if (!isLoading && !session && !previewOnly) {
    router.replace(LOGIN_ROUTE);
    return null;
  }

  const onSubmit = async (
    body: EventBody,
    coverFile?: File,
    galleryFiles: File[] = []
  ) => {
    setSaving(true);
    try {
      const res = body.recurrence
        ? await createSeries(body)
        : await createEvent(body);
      const slug = res.event?.slug;
      // One v2 upload. For a series the backend maps that URL onto every
      // occurrence — do not upload once per date.
      if (slug && coverFile) {
        try {
          const up = await uploadEventCover(slug, coverFile);
          if (up?.url)
            await updateEvent(slug, { ...body, cover_image: up.url });
        } catch {
          toast({
            title: 'Event saved, but the cover upload failed',
            description: 'You can add it from the edit page.',
          });
        }
      }
      let failedPhotoUploads = 0;
      if (slug) {
        for (const file of galleryFiles) {
          try {
            await uploadEventPhoto(slug, file);
          } catch {
            failedPhotoUploads += 1;
          }
        }
      }
      toast({
        title: 'Draft saved',
        description: 'It is not on Discover yet. Publish when you are ready.',
      });
      if (failedPhotoUploads) {
        toast({
          title: 'Some gallery photos did not upload',
          description: 'You can add them from the event page.',
        });
      }
      await invalidateAfterEventWrite(getQueryClient(), slug);
      router.push(slug ? `${EVENTS_ROUTE}/${slug}/manage` : EVENTS_ROUTE);
    } catch (err) {
      toast({ title: 'Could not create event', description: eventError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className='mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-10'>
      <div className='mb-4'>
        <BackButton href={EVENTS_ROUTE} />
      </div>
      <h1 className='font-newsreader text-3xl font-bold md:text-4xl'>
        Create event
      </h1>
      <p className='mb-6 mt-2 font-inter text-sm text-text-light/70 dark:text-text-dark/70'>
        Share the essentials. This stays a draft until you publish — people will
        not find it on Discover yet.
      </p>
      {previewOnly && (
        <p className='mb-5 rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-4 py-3 font-inter text-sm text-text-light dark:text-text-dark'>
          Local UI preview. Sign in to save an event.
        </p>
      )}
      <EventForm
        submitLabel='Save draft'
        saving={saving}
        onSubmit={onSubmit}
        previewOnly={previewOnly}
        onGalleryFilesChange={setGalleryPreviewFiles}
      />
      {previewOnly && (
        <div className='mt-10 space-y-8'>
          <p className='font-inter text-sm font-semibold text-gray-500 dark:text-gray-400'>
            Attendee view preview
          </p>
          <section
            aria-label='Attendees preview'
            className='rounded-xl border border-border-light/70 p-4 dark:border-border-dark/60'
          >
            <h2 className='font-newsreader text-2xl font-bold'>Attendees</h2>
            <p className='mt-2 font-inter text-sm text-gray-500 dark:text-gray-400'>
              Attendee information will appear here.
            </p>
          </section>
          <EventGalleryPreview files={galleryPreviewFiles} />
        </div>
      )}
    </main>
  );
}
