'use client';

import { EVENT_CATEGORIES } from '@/lib/eventCategories';

export function CategoryChips({
  selected,
  onToggle,
  variant = 'form',
}: {
  selected: string[];
  onToggle: (tag: string) => void;
  variant?: 'form' | 'hero';
}) {
  const hero = variant === 'hero';
  return (
    <div className='-mx-1 flex flex-wrap gap-2'>
      {EVENT_CATEGORIES.map((c) => {
        const on = selected.includes(c.tag);
        return (
          <button
            key={c.tag}
            type='button'
            onClick={() => onToggle(c.tag)}
            aria-pressed={on}
            className={
              hero
                ? `min-h-11 whitespace-nowrap rounded-full border px-4 py-2 font-inter text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    on
                      ? 'border-white bg-white text-brand-orange shadow-sm'
                      : 'border-white/30 text-white hover:border-white/60 hover:bg-white/10'
                  }`
                : `min-h-11 whitespace-nowrap rounded-full border-2 px-4 py-2 font-inter text-sm transition-colors ${
                    on
                      ? 'border-brand-orange bg-brand-orange text-white'
                      : 'border-border-light dark:border-border-dark'
                  }`
            }
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
