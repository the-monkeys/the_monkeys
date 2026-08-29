'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import {
  useDeleteGroup,
  usePublishGroup,
} from '@/hooks/groups/useGroupQueries';
import { isGroupOwner } from '@/lib/groupPerms';
import { groupError } from '@/services/groups/groupsApi';
import { GroupItem } from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

/**
 * Group lifecycle controls: publish a draft, jump to profile editing, and the
 * owner-only danger zone for deletion.
 */
export function GroupSettings({ group }: { group: GroupItem }) {
  const { toast } = useToast();
  const router = useRouter();
  const publish = usePublishGroup(group.slug);
  const remove = useDeleteGroup(group.slug);
  const owner = isGroupOwner(group);

  const onPublish = async () => {
    try {
      await publish.mutateAsync();
      toast({ title: 'Group published' });
    } catch (err) {
      toast({ title: 'Could not publish', description: groupError(err) });
    }
  };

  const onDelete = async () => {
    try {
      await remove.mutateAsync();
      toast({ title: 'Group deleted' });
      router.replace(GROUPS_ROUTE);
    } catch (err) {
      toast({ title: 'Could not delete', description: groupError(err) });
    }
  };

  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center gap-2'>
        {group.status === 'draft' && (
          <Button
            variant='brand'
            onClick={onPublish}
            disabled={publish.isPending}
          >
            Publish group
          </Button>
        )}
        <Button asChild variant='outline'>
          <Link href={`${GROUPS_ROUTE}/${group.slug}/edit`}>Edit details</Link>
        </Button>
        <span className='font-inter text-xs uppercase tracking-wide text-gray-500'>
          Status: {group.status}
        </span>
      </div>

      {owner && (
        <div className='rounded-lg border border-alert-red/40 p-4'>
          <p className='font-dm_sans font-semibold text-alert-red'>
            Danger zone
          </p>
          <p className='mb-3 mt-1 font-inter text-sm text-gray-500'>
            Deleting a group is permanent and removes its members, rules and
            events.
          </p>
          <ConfirmDialog
            trigger={
              <Button variant='destructive' size='sm'>
                Delete group
              </Button>
            }
            title={`Delete "${group.name}"?`}
            description='This cannot be undone.'
            confirmLabel='Delete group'
            destructive
            onConfirm={onDelete}
          />
        </div>
      )}
    </section>
  );
}
