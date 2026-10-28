'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GroupEmpty } from '@/components/groups/GroupCard';
import { GroupRulesEditor } from '@/components/groups/manage/GroupRulesEditor';
import { GroupSettings } from '@/components/groups/manage/GroupSettings';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { canManageGroup } from '@/lib/groupPerms';
import { Button } from '@the-monkeys/ui/atoms/button';

export default function ManageGroupPage({
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
    return <GroupEmpty title='You cannot manage this group' />;
  }

  return (
    <div className='mx-auto max-w-3xl pb-16'>
      <div className='mb-6 flex items-center justify-between gap-3'>
        <div className='min-w-0'>
          <Link
            href={`${GROUPS_ROUTE}/${group.slug}`}
            className='inline-flex items-center gap-1 font-inter text-sm text-gray-500 hover:text-brand-orange'
          >
            <Icon name='RiArrowLeftS' size={16} /> Back to group
          </Link>
          <h1 className='mt-1 truncate font-newsreader text-3xl font-bold md:text-4xl'>
            Manage {group.name}
          </h1>
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <Button asChild variant='brand' size='sm'>
          <Link href={`${GROUPS_ROUTE}/${group.slug}/events/new`}>
            Create event
          </Link>
        </Button>
        <Button asChild variant='outline' size='sm'>
          <Link href={`${GROUPS_ROUTE}/${group.slug}/members`}>Members</Link>
        </Button>
        <Button asChild variant='outline' size='sm'>
          <Link href={`${GROUPS_ROUTE}/${group.slug}/requests`}>
            Join requests
          </Link>
        </Button>
      </div>

      <div className='mt-8 space-y-10'>
        <GroupSettings group={group} />
        <GroupRulesEditor slug={group.slug} rules={group.rules} />
      </div>
    </div>
  );
}
