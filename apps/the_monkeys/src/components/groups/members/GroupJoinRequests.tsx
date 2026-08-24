'use client';

import Link from 'next/link';

import { Loader } from '@/components/loader';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import {
  useApproveJoinRequest,
  useGroupMembers,
  useRejectJoinRequest,
} from '@/hooks/groups/useGroupQueries';
import { parseEventTime } from '@/lib/eventTime';
import { ProtoTime } from '@/services/events/eventTypes';
import { groupError } from '@/services/groups/groupsApi';
import { GroupItem, GroupMember } from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

// Compact "time since" label for the request timestamp.
function requestedAgo(value: ProtoTime): string {
  const date = parseEventTime(value);
  if (!date) return '';
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

/**
 * Pending join-request queue. Staff approve or reject each applicant; the list
 * refreshes from the group members cache on every action.
 */
export function GroupJoinRequests({ group }: { group: GroupItem }) {
  const { data, isLoading } = useGroupMembers(
    group.slug,
    { status: 'pending', limit: 100 },
    true
  );

  const requests = data?.members || [];

  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader size={28} />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <p className='font-inter text-sm text-gray-500'>No pending requests.</p>
    );
  }

  return (
    <ul className='divide-y divide-border-light dark:divide-border-dark/40'>
      {requests.map((r) => (
        <RequestRow key={r.id} slug={group.slug} member={r} />
      ))}
    </ul>
  );
}

function RequestRow({ slug, member }: { slug: string; member: GroupMember }) {
  const { toast } = useToast();
  const approve = useApproveJoinRequest(slug);
  const reject = useRejectJoinRequest(slug);
  const busy = approve.isPending || reject.isPending;

  const act = async (fn: () => Promise<unknown>, ok: string, fail: string) => {
    try {
      await fn();
      toast({ title: ok });
    } catch (err) {
      toast({ title: fail, description: groupError(err) });
    }
  };

  return (
    <li className='flex flex-wrap items-center gap-3 py-3'>
      <Link href={`/${member.username}`} aria-label={member.username}>
        <ProfileFrame className='h-10 w-10'>
          <ProfileImage username={member.username} />
        </ProfileFrame>
      </Link>

      <div className='min-w-0 flex-1'>
        <Link
          href={`/${member.username}`}
          className='block truncate font-dm_sans font-medium hover:text-brand-orange'
        >
          @{member.username}
        </Link>
        {member.joined_at && (
          <span className='font-inter text-xs text-gray-500'>
            Requested {requestedAgo(member.joined_at)}
          </span>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <Button
          size='sm'
          variant='brand'
          disabled={busy}
          onClick={() =>
            act(
              () => approve.mutateAsync(member.username),
              'Request approved',
              'Could not approve'
            )
          }
        >
          Approve
        </Button>
        <Button
          size='sm'
          variant='ghost'
          disabled={busy}
          onClick={() =>
            act(
              () => reject.mutateAsync(member.username),
              'Request rejected',
              'Could not reject'
            )
          }
        >
          Reject
        </Button>
      </div>
    </li>
  );
}
