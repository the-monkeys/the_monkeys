import { GroupRule } from '@/services/groups/groupsTypes';

/**
 * Ordered list of group rules. Rendered only when the group has rules; the
 * organizer authors them from the group settings surface (Phase 6).
 */
export function GroupRules({ rules }: { rules?: GroupRule[] }) {
  if (!rules || rules.length === 0) return null;

  const sorted = [...rules].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return (
    <section>
      <h2 className='mb-4 font-newsreader text-2xl font-bold'>Group rules</h2>
      <ol className='space-y-4'>
        {sorted.map((rule, i) => (
          <li key={rule.id} className='flex gap-3'>
            <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 font-inter text-sm font-bold text-brand-orange'>
              {i + 1}
            </span>
            <div className='min-w-0'>
              <p className='font-dm_sans font-semibold'>{rule.title}</p>
              {rule.body && (
                <p className='mt-0.5 font-inter text-sm text-gray-500 dark:text-gray-400'>
                  {rule.body}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
