'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useJoinGroup, useLeaveGroup } from '@/hooks/groups/useGroupQueries';
import { cn } from '@/lib/utils';
import { groupError } from '@/services/groups/groupsApi';
import { GroupItem } from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

/**
 * Primary membership control. Renders the right affordance for the viewer's
 * standing: join / request-to-join, a pending badge, a leave button, or an
 * organizer marker. The service arbitrates join semantics (public groups admit
 * immediately, private groups record a pending request).
 */
export function GroupJoinButton({
  group,
  className,
}: {
  group: GroupItem;
  className?: string;
}) {
  const { data: session } = useAuth();
  const { toast } = useToast();
  const join = useJoinGroup(group.slug);
  const leave = useLeaveGroup(group.slug);

  const status = group.viewer_member_status;
  const isPrivate = group.visibility !== 'public';
  const joinLabel = isPrivate ? 'Request to join' : 'Join group';

  if (!session) {
    return (
      <Button asChild variant='brand' className={className}>
        <Link href={LOGIN_ROUTE}>{joinLabel}</Link>
      </Button>
    );
  }

  if (status === 'banned') {
    return (
      <Button variant='outline' className={className} disabled>
        Unavailable
      </Button>
    );
  }

  if (status === 'pending') {
    return (
      <Button variant='outline' className={cn('gap-1.5', className)} disabled>
        <Icon name='RiHistory' size={16} /> Requested
      </Button>
    );
  }

  if (status === 'active') {
    // The organizer cannot leave their own group; they manage it instead.
    if (group.viewer_role === 'organizer') {
      return (
        <Button variant='outline' className={cn('gap-1.5', className)} disabled>
          <Icon name='RiCheck' size={16} /> You organize this
        </Button>
      );
    }
    return (
      <Button
        variant='outline'
        className={cn('gap-1.5', className)}
        disabled={leave.isPending}
        onClick={async () => {
          try {
            const res = await leave.mutateAsync();
            toast({ title: res.message || 'Left group' });
          } catch (err) {
            toast({ title: 'Could not leave', description: groupError(err) });
          }
        }}
      >
        <Icon name='RiCheck' size={16} /> Joined
      </Button>
    );
  }

  return (
    <Button
      variant='brand'
      className={className}
      disabled={join.isPending}
      onClick={async () => {
        try {
          const res = await join.mutateAsync(undefined);
          toast({
            title:
              res.message || (isPrivate ? 'Request sent' : 'Welcome aboard!'),
          });
        } catch (err) {
          toast({ title: 'Could not join', description: groupError(err) });
        }
      }}
    >
      {joinLabel}
    </Button>
  );
}
