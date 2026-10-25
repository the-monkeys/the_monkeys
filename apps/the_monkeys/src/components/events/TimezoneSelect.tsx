'use client';

import { useId, useMemo } from 'react';

import { defaultTimezone, isValidTimezone } from '@/lib/eventTime';

export function TimezoneSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (timezone: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const zones = useMemo(() => {
    const intl = Intl as typeof Intl & {
      supportedValuesOf?: (key: 'timeZone') => string[];
    };
    const supported = intl.supportedValuesOf?.('timeZone') || [
      'Europe/Berlin',
      'Europe/London',
      'America/New_York',
      'America/Los_Angeles',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];
    return Array.from(
      new Set([
        'UTC',
        'Asia/Kolkata',
        defaultTimezone(),
        ...supported,
        ...(isValidTimezone(value) ? [value] : []),
      ])
    ).sort();
  }, [value]);
  return (
    <div className='space-y-1.5'>
      <label htmlFor={id} className='font-inter text-sm font-medium'>
        Event timezone
      </label>
      <select
        id={id}
        name='timezone'
        required
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className='w-full rounded-md border-2 border-border-light bg-background-light px-3 py-2 font-inter text-sm dark:border-border-dark dark:bg-background-dark'
      >
        {!isValidTimezone(value) && (
          <option value={value} disabled>
            Choose a valid timezone{value ? ` (saved value: ${value})` : ''}
          </option>
        )}
        {zones.map((zone) => (
          <option key={zone} value={zone}>
            {zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta'
              ? `India (IST): ${zone}`
              : zone.replaceAll('_', ' ')}
          </option>
        ))}
      </select>
      <p className='font-inter text-xs text-gray-500'>
        Start and end times use this timezone. Guests see the time in their own
        timezone.
      </p>
    </div>
  );
}
