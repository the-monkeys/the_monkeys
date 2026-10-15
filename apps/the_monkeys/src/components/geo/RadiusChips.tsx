'use client';

import { SEARCH_RADIUS_STEPS_KM } from '@/lib/geoSearch';

export type RadiusChoice = number | 'everywhere';

export function RadiusChips({
  value,
  onChange,
  variant = 'light',
}: {
  value: RadiusChoice;
  onChange: (value: RadiusChoice) => void;
  variant?: 'hero' | 'light';
}) {
  const hero = variant === 'hero';
  const chip = (active: boolean) =>
    hero
      ? active
        ? 'border-white bg-white text-brand-orange shadow-sm'
        : 'border-white/30 text-white hover:border-white/60 hover:bg-white/10'
      : active
        ? 'border-brand-orange bg-brand-orange text-white'
        : 'border-border-light text-gray-600 hover:border-brand-orange/50 dark:border-border-dark/40 dark:text-gray-300';

  return (
    <div
      className='flex flex-wrap gap-2'
      role='group'
      aria-label='Search distance'
    >
      {SEARCH_RADIUS_STEPS_KM.map((km) => (
        <button
          key={km}
          type='button'
          aria-pressed={value === km}
          onClick={() => onChange(km)}
          className={`rounded-full border px-3 py-1.5 font-inter text-sm transition-colors ${chip(value === km)}`}
        >
          {km} km
        </button>
      ))}
      <button
        type='button'
        aria-pressed={value === 'everywhere'}
        onClick={() => onChange('everywhere')}
        className={`rounded-full border px-3 py-1.5 font-inter text-sm transition-colors ${chip(value === 'everywhere')}`}
      >
        Everywhere
      </button>
    </div>
  );
}
