import Link from 'next/link';

import Icon, { IconName } from '@/components/icon';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import { cn } from '@/lib/utils';
import { GroupItem, GroupVisibility } from '@/services/groups/groupsTypes';

const VISIBILITY_META: Record<
  GroupVisibility,
  { label: string; icon: IconName | null }
> = {
  public: { label: 'Public', icon: null },
  private: { label: 'Private', icon: 'RiLock' },
  unlisted: { label: 'Unlisted', icon: 'RiEyeClose' },
};

function memberLabel(count?: number): string {
  const n = count ?? 0;
  return `${n.toLocaleString()} ${n === 1 ? 'member' : 'members'}`;
}

// Small pill shown when the signed-in viewer already has standing in the group.
function membershipBadge(group: GroupItem): string | null {
  if (group.viewer_member_status === 'active') {
    return group.viewer_role && group.viewer_role !== 'member'
      ? 'Organizer'
      : 'Member';
  }
  if (group.viewer_member_status === 'pending') return 'Requested';
  return null;
}

function Thumb({ group }: { group: GroupItem }) {
  const src = group.logo_image || group.cover_image;
  if (src) {
    return (
      <img
        src={src}
        alt=''
        className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
        loading='lazy'
      />
    );
  }
  return (
    <div className='flex h-full w-full items-center justify-center bg-brand-orange/10 text-brand-orange'>
      <Icon name='RiGroup' size={28} />
    </div>
  );
}

export function GroupCard({ group }: { group: GroupItem }) {
  const href = `${GROUPS_ROUTE}/${group.slug}`;
  const topic = group.topics?.[0];
  const visibility =
    VISIBILITY_META[group.visibility] ?? VISIBILITY_META.public;
  const badge = membershipBadge(group);
  const place = [group.city, group.region].filter(Boolean).join(', ');

  return (
    <article className='group flex items-start gap-4 sm:gap-6 py-5 border-b border-border-light dark:border-border-dark/40 last:border-b-0'>
      <div className='flex-1 min-w-0'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.15em]'>
            {topic || 'Community'}
          </span>
          {group.visibility !== 'public' && (
            <span className='inline-flex items-center gap-1 font-inter text-[10px] uppercase tracking-wider text-gray-500'>
              {visibility.icon && <Icon name={visibility.icon} size={12} />}
              {visibility.label}
            </span>
          )}
          {badge && (
            <span className='inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 font-inter text-[10px] font-medium text-brand-orange'>
              <Icon name='RiCheck' size={12} />
              {badge}
            </span>
          )}
        </div>

        <Link href={href} className='block mt-1.5'>
          <h3 className='font-newsreader font-bold md:text-2xl text-lg leading-[1.25] text-text-light dark:text-text-dark group-hover:text-brand-orange transition-colors line-clamp-2'>
            {group.name}
          </h3>
        </Link>

        {group.description && (
          <p className='mt-1.5 font-inter text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
            {group.description}
          </p>
        )}

        <div className='mt-2 flex flex-wrap items-center gap-3 text-xs font-inter text-gray-500 dark:text-gray-400'>
          <span className='inline-flex items-center gap-1'>
            <Icon name='RiGroup' size={14} />
            {memberLabel(group.member_count)}
          </span>
          {place && (
            <span className='inline-flex items-center gap-1'>
              <Icon name='RiMapPinUser' size={14} />
              <span className='line-clamp-1'>{place}</span>
            </span>
          )}
          {group.organizer_username && (
            <Link
              href={`/${group.organizer_username}`}
              className='hover:text-brand-orange'
            >
              @{group.organizer_username}
            </Link>
          )}
        </div>
      </div>

      <Link
        href={href}
        className='shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800'
        aria-label={group.name}
      >
        <Thumb group={group} />
      </Link>
    </article>
  );
}

export function GroupEmpty({
  title,
  hint,
  className,
}: {
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn('py-16 text-center', className)}>
      <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
        <Icon name='RiGroup' size={28} />
      </div>
      <h3 className='font-newsreader text-2xl font-bold'>{title}</h3>
      {hint && (
        <p className='mt-2 font-inter text-sm text-gray-500 dark:text-gray-400'>
          {hint}
        </p>
      )}
    </div>
  );
}
