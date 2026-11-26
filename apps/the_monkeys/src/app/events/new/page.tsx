'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/buttons/backButton';
import { EventForm } from '@/components/events/EventForm';
import { EVENTS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useCreationAttempt } from '@/hooks/useCreationAttempt';
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
  const submitting = useRef(false);
  const attempt = useCreationAttempt(
    `events:${session?.account_id || session?.username || ''}`
  );

  if (!isLoading && !session) {
    router.replace(LOGIN_ROUTE);
    return null;
  }

  const onSubmit = async (
    body: EventBody,
    coverFile?: File,
    galleryFiles: File[] = []
  ) => {
    if (submitting.current) return;
    submitting.current = true;
    setSaving(true);
    let created = false;
    try {
      await attempt.run(body, async (key) => {
        const res = body.recurrence
          ? await createSeries(body, key)
          : await createEvent(body, key);
        created = true;
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
      });
    } catch (err) {
      // App Router push returns before the old page unmounts. Keep a saved
      // creation locked even if a later refresh/navigation step fails.
      if (!created) {
        submitting.current = false;
        setSaving(false);
      }
      toast({ title: 'Could not create event', description: eventError(err) });
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
      <EventForm submitLabel='Save draft' saving={saving} onSubmit={onSubmit} />
    </main>
  );
}
