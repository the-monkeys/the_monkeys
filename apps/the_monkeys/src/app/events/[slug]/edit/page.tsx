'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { BackButton } from '@/components/buttons/backButton';
import { EventEmpty } from '@/components/events/EventCard';
import { EventForm } from '@/components/events/EventForm';
import { Loader } from '@/components/loader';
import { EVENTS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useEventDetail } from '@/hooks/events/useEventQueries';
import { isHost } from '@/lib/eventTime';
import { EventBody } from '@/services/events/eventTypes';
import { eventError, updateEvent } from '@/services/events/eventsApi';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export default function EditEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useEventDetail(params.slug);
  const event = data?.event;
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const host = isHost(event, session?.username);

  if (!authLoading && !session) {
    router.replace(LOGIN_ROUTE);
    return null;
  }

  if (isLoading || authLoading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader size={32} />
      </div>
    );
  }

  if (!event || !host) {
    return <EventEmpty title='You cannot edit this event' />;
  }

  const onSubmit = async (body: EventBody) => {
    setSaving(true);
    try {
      await updateEvent(event.slug, body);
      toast({ title: 'Saved' });
      router.push(`${EVENTS_ROUTE}/${event.slug}`);
    } catch (err) {
      toast({ title: 'Could not save', description: eventError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='mx-auto max-w-2xl'>
      <div className='mb-4'>
        <BackButton href={`${EVENTS_ROUTE}/${event.slug}`} />
      </div>
      <h1 className='font-newsreader font-bold text-3xl md:text-4xl mb-6'>
        Edit event
      </h1>
      <EventForm
        event={event}
        submitLabel='Save changes'
        saving={saving}
        onSubmit={onSubmit}
      />
    </div>
  );
}
