'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/buttons/backButton';
import { EventForm } from '@/components/events/EventForm';
import { EVENTS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { EventBody } from '@/services/events/eventTypes';
import {
  createEvent,
  eventError,
  updateEvent,
  uploadEventCover,
} from '@/services/events/eventsApi';
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
      const res = await createEvent(body);
      const slug = res.event?.slug;
      // A cover picked before the event existed is uploaded now and persisted
      // on the event. Failure here must not lose the draft, so it is non-fatal.
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
      toast({ title: 'Draft saved' });
      router.push(slug ? `${EVENTS_ROUTE}/${slug}/manage` : EVENTS_ROUTE);
    } catch (err) {
      toast({ title: 'Could not create event', description: eventError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='mx-auto max-w-2xl'>
      <div className='mb-4'>
        <BackButton />
      </div>
      <h1 className='font-newsreader font-bold text-3xl md:text-4xl mb-6'>
        Create event
      </h1>
      <EventForm submitLabel='Save draft' saving={saving} onSubmit={onSubmit} />
    </div>
  );
}
