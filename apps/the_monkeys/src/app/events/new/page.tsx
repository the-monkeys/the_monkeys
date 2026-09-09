'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/buttons/backButton';
import { EventForm } from '@/components/events/EventForm';
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
} from '@/services/events/eventsApi';
import { getQueryClient } from '@/utils/get-query-client';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export default function NewEventPage() {
  const { data: session, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  if (!isLoading && !session) {
    router.replace(LOGIN_ROUTE);
    return null;
  }

  const onSubmit = async (body: EventBody, coverFile?: File) => {
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
      toast({
        title: 'Draft saved',
        description: 'It is not on Discover yet. Publish when you are ready.',
      });
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
      <EventForm submitLabel='Save draft' saving={saving} onSubmit={onSubmit} />
    </main>
  );
}
