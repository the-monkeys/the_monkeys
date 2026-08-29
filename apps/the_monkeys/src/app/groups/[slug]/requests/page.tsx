'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GroupEmpty } from '@/components/groups/GroupCard';
import { GroupJoinRequests } from '@/components/groups/members/GroupJoinRequests';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { canManageGroup } from '@/lib/groupPerms';

export default function GroupRequestsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useGroupDetail(params.slug);
  const group = data?.group;
  const router = useRouter();

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

  if (!group || !canManageGroup(group)) {
    return <GroupEmpty title='You cannot review requests for this group' />;
  }

  return (
    <div className='mx-auto max-w-3xl pb-16'>
      <Link
        href={`${GROUPS_ROUTE}/${group.slug}/manage`}
        className='inline-flex items-center gap-1 font-inter text-sm text-gray-500 hover:text-brand-orange'
      >
        <Icon name='RiArrowLeftS' size={16} /> Manage {group.name}
      </Link>
      <h1 className='mb-6 mt-1 font-newsreader text-3xl font-bold md:text-4xl'>
        Join requests
      </h1>

      <GroupJoinRequests group={group} />
    </div>
  );
}
