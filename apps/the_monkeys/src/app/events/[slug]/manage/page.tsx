'use client';

import { useRouter } from 'next/navigation';

import { EventEmpty } from '@/components/events/EventCard';
import { EventManage } from '@/components/events/EventManage';
import { Loader } from '@/components/loader';
import { LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useEventDetail } from '@/hooks/events/useEventQueries';
import { isHost } from '@/lib/eventTime';

export default function ManageEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useEventDetail(params.slug);
  const event = data?.event;
  const router = useRouter();
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
    return <EventEmpty title='You cannot manage this event' />;
  }

  return (
    <div className='mx-auto max-w-3xl'>
      <p className='font-inter text-xs uppercase tracking-[0.18em] text-gray-500 mb-1'>
        {event.status}
      </p>
      <h1 className='font-newsreader font-bold text-3xl md:text-4xl mb-8'>
        {event.title}
      </h1>
      <EventManage event={event} session={session} />
    </div>
  );
}
