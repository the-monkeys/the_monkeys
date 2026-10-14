import Link from 'next/link';

import Icon from '@/components/icon';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import { GroupItem } from '@/services/groups/groupsTypes';

function memberLabel(count?: number): string {
  const n = count ?? 0;
  return `${n.toLocaleString()} ${n === 1 ? 'member' : 'members'}`;
}

function Cover({ group }: { group: GroupItem }) {
  const src = group.cover_image || group.logo_image;
  if (src) {
    return (
      <img
        src={src}
        alt=''
        loading='lazy'
        className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
      />
    );
  }
  return (
    <div className='absolute inset-0 flex items-center justify-center bg-brand-orange/10 text-brand-orange'>
      <Icon name='RiGroup' size={32} />
    </div>
  );
}

// Vertical, cover-forward community card for grid layouts (distinct from the
// horizontal GroupCard used in the editorial /groups list).
export function GroupGridCard({ group }: { group: GroupItem }) {
  const href = `${GROUPS_ROUTE}/${group.slug}`;
  const topic = group.topics?.[0];
  const place = [group.city, group.region].filter(Boolean).join(', ');

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-xl border border-border-light bg-white transition-shadow duration-300 hover:shadow-lg dark:border-border-dark/40 dark:bg-black/20'>
      <Link
        href={href}
        aria-label={group.name}
        className='relative block aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800'
      >
        <Cover group={group} />
        {group.status && group.status !== 'published' && (
          <span className='absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-inter text-[10px] font-bold uppercase tracking-wider text-white'>
            {group.status}
          </span>
        )}
      </Link>

      <div className='flex flex-1 flex-col p-4'>
        <p className='font-inter text-[11px] font-bold uppercase tracking-[0.15em] text-brand-orange'>
          {topic || 'Community'}
        </p>
        <Link href={href} className='mt-1.5 block'>
          <h3 className='font-newsreader text-lg font-bold leading-[1.25] text-text-light transition-colors line-clamp-2 group-hover:text-brand-orange dark:text-text-dark'>
            {group.name}
          </h3>
        </Link>

        <div className='mt-auto flex flex-wrap items-center gap-3 pt-3 font-inter text-xs text-gray-500 dark:text-gray-400'>
          <span className='inline-flex items-center gap-1'>
            <Icon name='RiGroup' size={14} />
            {memberLabel(group.member_count)}
          </span>
          {place && (
            <span className='inline-flex items-center gap-1 truncate'>
              <Icon name='RiMapPinUser' size={14} />
              <span className='line-clamp-1'>{place}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
