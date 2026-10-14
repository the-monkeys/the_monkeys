'use client';

import { useEffect, useMemo, useState } from 'react';

import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { useAddMember } from '@/hooks/groups/useGroupQueries';
import { useSearchPeopleV2 } from '@/hooks/search/useSearchV2';
import { groupError } from '@/services/groups/groupsApi';
import { AddMemberBody, GroupItem } from '@/services/groups/groupsTypes';
import { Input } from '@the-monkeys/ui/atoms/input';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

type Role = NonNullable<AddMemberBody['role']>;

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'member', label: 'Member' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'co_organizer', label: 'Co-organizer' },
];

/**
 * Staff-only control to enroll a user directly. Autocompletes usernames against
 * the people search endpoint (active users only) and adds the chosen user as an
 * active member with the selected role, bypassing the pending queue.
 */
export function GroupAddMember({ group }: { group: GroupItem }) {
  const { toast } = useToast();
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [open, setOpen] = useState(false);

  const add = useAddMember(group.slug);

  // Debounce keystrokes so we don't fire a search per character.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 250);
    return () => clearTimeout(id);
  }, [term]);

  const { users, isLoading } = useSearchPeopleV2({
    query: debounced,
    limit: 6,
    enabled: open && debounced.length > 0,
  });

  const results = useMemo(() => users ?? [], [users]);

  const onAdd = async (username: string) => {
    try {
      await add.mutateAsync({ username, role });
      toast({ title: `Added @${username}` });
      setTerm('');
      setDebounced('');
      setOpen(false);
    } catch (err) {
      toast({ title: 'Could not add member', description: groupError(err) });
    }
  };

  return (
    <div className='mb-4 rounded-lg border border-border-light p-3 dark:border-border-dark'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Input
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder='Add a member by username…'
            aria-label='Search users to add'
          />

          {open && debounced.length > 0 && (
            <div className='absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border-light bg-white shadow-lg dark:border-border-dark dark:bg-primary-monkeyBlack'>
              {isLoading ? (
                <p className='px-3 py-2 font-inter text-sm text-gray-500'>
                  Searching…
                </p>
              ) : results.length === 0 ? (
                <p className='px-3 py-2 font-inter text-sm text-gray-500'>
                  No matches
                </p>
              ) : (
                <ul className='max-h-64 overflow-y-auto'>
                  {results.map((u) => (
                    <li key={u.account_id}>
                      <button
                        type='button'
                        onClick={() => onAdd(u.username)}
                        disabled={add.isPending}
                        className='flex min-h-[44px] w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800'
                      >
                        <ProfileFrame className='h-8 w-8'>
                          <ProfileImage username={u.username} />
                        </ProfileFrame>
                        <span className='min-w-0'>
                          <span className='block truncate font-dm_sans text-sm font-medium'>
                            @{u.username}
                          </span>
                          {(u.first_name || u.last_name) && (
                            <span className='block truncate font-inter text-xs text-gray-500'>
                              {`${u.first_name} ${u.last_name}`.trim()}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <select
          aria-label='Role for new member'
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className='rounded-md border-2 border-border-light bg-transparent px-2 py-2 font-inter text-sm dark:border-border-dark'
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
