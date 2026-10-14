'use client';

import { useState } from 'react';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Loader } from '@/components/loader';
import {
  useCreateInvite,
  useGroupInvites,
  useRevokeInvite,
} from '@/hooks/groups/useGroupQueries';
import { parseEventTime } from '@/lib/eventTime';
import { groupError } from '@/services/groups/groupsApi';
import {
  CreateInviteBody,
  GroupInvite,
  GroupItem,
} from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

type Role = NonNullable<CreateInviteBody['role']>;

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'member', label: 'Member' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'co_organizer', label: 'Co-organizer' },
];

const inviteLink = (token: string) =>
  typeof window === 'undefined'
    ? `/groups/invite/${token}`
    : `${window.location.origin}/groups/invite/${token}`;

function InviteRow({ slug, invite }: { slug: string; invite: GroupInvite }) {
  const { toast } = useToast();
  const revoke = useRevokeInvite(slug);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink(invite.token));
      toast({ title: 'Invite link copied' });
    } catch {
      toast({ title: 'Copy failed', description: 'Copy the link manually.' });
    }
  };

  const onRevoke = async () => {
    try {
      await revoke.mutateAsync(invite.id);
      toast({ title: 'Invite revoked' });
    } catch (err) {
      toast({ title: 'Could not revoke', description: groupError(err) });
    }
  };

  const usage =
    invite.max_uses > 0
      ? `${invite.uses}/${invite.max_uses} uses`
      : `${invite.uses} uses`;

  const expiry = invite.expires_at ? parseEventTime(invite.expires_at) : null;

  return (
    <li className='flex flex-col gap-2 rounded-lg border border-border-light p-3 dark:border-border-dark sm:flex-row sm:items-center sm:justify-between'>
      <div className='min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='font-dm_sans text-sm font-medium capitalize'>
            {invite.role.replace('_', ' ')}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 font-inter text-xs ${
              invite.active
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
            }`}
          >
            {invite.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <p className='mt-0.5 truncate font-inter text-xs text-gray-500'>
          {usage}
          {expiry
            ? ` · expires ${expiry.toLocaleDateString()}`
            : ' · no expiry'}
        </p>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        <Button
          variant='secondary'
          className='min-h-[44px]'
          onClick={copy}
          disabled={!invite.active}
        >
          Copy link
        </Button>
        {!invite.revoked && (
          <ConfirmDialog
            trigger={
              <Button
                variant='secondary'
                className='min-h-[44px]'
                disabled={revoke.isPending}
              >
                Revoke
              </Button>
            }
            title='Revoke invite?'
            description='This link will stop working immediately.'
            confirmLabel='Revoke'
            destructive
            onConfirm={onRevoke}
          />
        )}
      </div>
    </li>
  );
}

/**
 * Staff-only invite-link management. Lists active/inactive invites and lets
 * organizers mint new ones scoped to a role, use count, and expiry.
 */
export function GroupInvites({ group }: { group: GroupItem }) {
  const { toast } = useToast();
  const { data, isLoading } = useGroupInvites(group.slug, true);
  const create = useCreateInvite(group.slug);

  const [role, setRole] = useState<Role>('member');
  const [maxUses, setMaxUses] = useState('');
  const [expiresIn, setExpiresIn] = useState('');

  const onCreate = async () => {
    try {
      const body: CreateInviteBody = { role };
      const mu = parseInt(maxUses, 10);
      if (Number.isFinite(mu) && mu > 0) body.max_uses = mu;
      const ex = parseInt(expiresIn, 10);
      if (Number.isFinite(ex) && ex > 0) body.expires_in_hours = ex;
      await create.mutateAsync(body);
      toast({ title: 'Invite created' });
      setMaxUses('');
      setExpiresIn('');
    } catch (err) {
      toast({ title: 'Could not create invite', description: groupError(err) });
    }
  };

  const invites = data?.invites ?? [];

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border border-border-light p-3 dark:border-border-dark'>
        <p className='mb-2 font-dm_sans text-sm font-medium'>
          Create invite link
        </p>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
          <label className='flex flex-col gap-1 font-inter text-xs text-gray-500'>
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className='rounded-md border-2 border-border-light bg-transparent px-2 py-2 font-inter text-sm text-primary-monkeyBlack dark:border-border-dark dark:text-primary-monkeyWhite'
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className='flex flex-col gap-1 font-inter text-xs text-gray-500'>
            Max uses (0 = ∞)
            <input
              type='number'
              min={0}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder='0'
              className='w-28 rounded-md border-2 border-border-light bg-transparent px-2 py-2 font-inter text-sm dark:border-border-dark'
            />
          </label>
          <label className='flex flex-col gap-1 font-inter text-xs text-gray-500'>
            Expires (hours)
            <input
              type='number'
              min={0}
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              placeholder='0'
              className='w-28 rounded-md border-2 border-border-light bg-transparent px-2 py-2 font-inter text-sm dark:border-border-dark'
            />
          </label>
          <Button
            className='min-h-[44px]'
            onClick={onCreate}
            disabled={create.isPending}
          >
            Create
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : invites.length === 0 ? (
        <p className='font-inter text-sm text-gray-500'>No invite links yet.</p>
      ) : (
        <ul className='space-y-2'>
          {invites.map((inv) => (
            <InviteRow key={inv.id} slug={group.slug} invite={inv} />
          ))}
        </ul>
      )}
    </div>
  );
}
