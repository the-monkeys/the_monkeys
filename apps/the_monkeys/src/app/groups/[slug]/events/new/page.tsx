'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GroupEmpty } from '@/components/groups/GroupCard';
import { GroupEventForm } from '@/components/groups/GroupEventForm';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import {
  EVENTS_ROUTE,
  GROUPS_ROUTE,
  LOGIN_ROUTE,
} from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import {
  useCreateGroupEvent,
  useGroupDetail,
} from '@/hooks/groups/useGroupQueries';
import { canManageGroup } from '@/lib/groupPerms';
import { groupError } from '@/services/groups/groupsApi';
import { GroupEventBody } from '@/services/groups/groupsTypes';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export default function NewGroupEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useGroupDetail(params.slug);
  const group = data?.group;
  const router = useRouter();
  const { toast } = useToast();
  const create = useCreateGroupEvent(params.slug);

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

  // The events service re-checks authorization; gate the entry to staff so the
  // form is only shown to those who may create events for the group.
  if (!group || !canManageGroup(group)) {
    return <GroupEmpty title='You cannot create events for this group' />;
  }

  const onSubmit = async (body: GroupEventBody) => {
    try {
      const res = await create.mutateAsync(body);
      const slug = res.event?.slug;
      toast({ title: 'Event created' });
      router.push(slug ? `${EVENTS_ROUTE}/${slug}` : EVENTS_ROUTE);
    } catch (err) {
      toast({ title: 'Could not create event', description: groupError(err) });
    }
  };

  return (
    <div className='mx-auto max-w-2xl pb-16'>
      <Link
        href={`${GROUPS_ROUTE}/${group.slug}`}
        className='inline-flex items-center gap-1 font-inter text-sm text-gray-500 hover:text-brand-orange'
      >
        <Icon name='RiArrowLeftS' size={16} /> {group.name}
      </Link>
      <h1 className='mb-1 mt-1 font-newsreader text-3xl font-bold md:text-4xl'>
        Create an event
      </h1>
      <p className='mb-6 font-inter text-sm text-gray-500'>
        This event will be hosted by {group.name}.
      </p>

      <GroupEventForm
        submitLabel='Create event'
        saving={create.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
