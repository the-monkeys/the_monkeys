'use client';

import { useRouter } from 'next/navigation';

import { GroupForm } from '@/components/groups/GroupForm';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useCreateGroup } from '@/hooks/groups/useGroupQueries';
import { groupError } from '@/services/groups/groupsApi';
import { GroupBody } from '@/services/groups/groupsTypes';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export default function NewGroupPage() {
  const { data: session, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const create = useCreateGroup();

  if (!isLoading && !session) {
    router.replace(LOGIN_ROUTE);
    return null;
  }

  const onSubmit = async (body: GroupBody) => {
    try {
      const res = await create.mutateAsync(body);
      const slug = res.group?.slug;
      toast({ title: 'Draft created' });
      router.push(slug ? `${GROUPS_ROUTE}/${slug}/manage` : GROUPS_ROUTE);
    } catch (err) {
      toast({ title: 'Could not create group', description: groupError(err) });
    }
  };

  return (
    <div className='mx-auto max-w-2xl'>
      <h1 className='mb-6 font-newsreader text-3xl font-bold md:text-4xl'>
        Start a group
      </h1>
      <GroupForm
        submitLabel='Create draft'
        saving={create.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
