'use client';

import { useRouter } from 'next/navigation';

import { GroupEmpty } from '@/components/groups/GroupCard';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import {
  useAcceptInvite,
  useInvitePreview,
} from '@/hooks/groups/useGroupQueries';
import { loginHref } from '@/lib/authRedirect';
import { groupError } from '@/services/groups/groupsApi';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

/**
 * Public invite-acceptance page. The preview endpoint is auth-optional so a
 * signed-out visitor still sees which group they were invited to; accepting
 * requires authentication and is enforced server-side.
 */
export default function GroupInvitePage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, isLoading: authLoading } = useAuth();
  const { data, isLoading, isError } = useInvitePreview(token);
  const accept = useAcceptInvite();

  if (isLoading || authLoading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader size={32} />
      </div>
    );
  }

  const invite = data?.invite;

  if (isError || !invite || !invite.active) {
    return <GroupEmpty title='This invite link is no longer valid' />;
  }

  const onAccept = async () => {
    try {
      await accept.mutateAsync(token);
      toast({ title: `Joined ${invite.group_name ?? 'the group'}` });
      router.replace(`${GROUPS_ROUTE}/${invite.group_slug ?? ''}`);
    } catch (err) {
      toast({ title: 'Could not join', description: groupError(err) });
    }
  };

  return (
    <div className='mx-auto max-w-md px-4 py-16 text-center'>
      <Icon
        name='RiGroup'
        size={40}
        className='mx-auto mb-4 text-brand-orange'
      />
      <h1 className='font-newsreader text-3xl font-bold'>
        {invite.group_name ?? 'Group invite'}
      </h1>
      <p className='mt-2 font-inter text-sm text-gray-500'>
        You&rsquo;ve been invited to join
        {invite.group_visibility
          ? ` this ${invite.group_visibility} group`
          : ' this group'}
        {invite.role !== 'member'
          ? ` as a ${invite.role.replace('_', ' ')}`
          : ''}
        .
      </p>

      <div className='mt-6'>
        {session ? (
          <Button
            className='min-h-[44px] w-full'
            onClick={onAccept}
            disabled={accept.isPending}
          >
            {accept.isPending ? 'Joining…' : 'Join group'}
          </Button>
        ) : (
          <Button
            className='min-h-[44px] w-full'
            onClick={() => router.push(loginHref(`/groups/invite/${token}`))}
          >
            Sign in to join
          </Button>
        )}
      </div>
    </div>
  );
}
