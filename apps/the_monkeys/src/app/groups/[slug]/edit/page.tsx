'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { GroupEmpty } from '@/components/groups/GroupCard';
import { GroupForm } from '@/components/groups/GroupForm';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useGroupDetail, useUpdateGroup } from '@/hooks/groups/useGroupQueries';
import { canEditGroup } from '@/lib/groupPerms';
import { groupError } from '@/services/groups/groupsApi';
import { GroupBody } from '@/services/groups/groupsTypes';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export default function EditGroupPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useGroupDetail(params.slug);
  const group = data?.group;
  const router = useRouter();
  const { toast } = useToast();
  const update = useUpdateGroup(params.slug);

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

  if (!group || !canEditGroup(group)) {
    return <GroupEmpty title='You cannot edit this group' />;
  }

  const onSubmit = async (body: GroupBody) => {
    try {
      await update.mutateAsync(body);
      toast({ title: 'Saved' });
      router.push(`${GROUPS_ROUTE}/${group.slug}`);
    } catch (err) {
      toast({ title: 'Could not save', description: groupError(err) });
    }
  };

  return (
    <div className='mx-auto max-w-2xl'>
      <Link
        href={`${GROUPS_ROUTE}/${group.slug}`}
        className='inline-flex items-center gap-1 font-inter text-sm text-gray-500 hover:text-brand-orange'
      >
        <Icon name='RiArrowLeftS' size={16} /> Back to group
      </Link>
      <h1 className='mb-6 mt-1 font-newsreader text-3xl font-bold md:text-4xl'>
        Edit group
      </h1>
      <GroupForm
        group={group}
        submitLabel='Save changes'
        saving={update.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
