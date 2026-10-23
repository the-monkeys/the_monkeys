'use client';

import { useEffect, useState } from 'react';

import {
  defaultTimezone,
  eventDateParts,
  formatEventTimeForViewer,
} from '@/lib/eventTime';
import { ProtoTime } from '@/services/events/eventTypes';

type Props = {
  start?: ProtoTime;
  end?: ProtoTime;
  timezone?: string;
  compact?: boolean;
  className?: string;
};

/** Shows each event in the attendee's local timezone with the event time as a reference. */
export function EventTimeDisplay({
  start,
  end,
  timezone,
  compact = false,
  className,
}: Props) {
  const [viewerTimezone, setViewerTimezone] = useState(timezone || 'UTC');

  useEffect(() => {
    setViewerTimezone(defaultTimezone());
  }, []);

  const labels = formatEventTimeForViewer(
    start,
    end,
    timezone,
    viewerTimezone,
    compact
  );

  return (
    <span className={className}>
      <span className='block'>{labels.primary}</span>
      {labels.secondary && (
        <span className='mt-0.5 block text-xs font-normal text-current opacity-80'>
          {labels.secondary}
        </span>
      )}
    </span>
  );
}

export function EventDatePart({
  start,
  timezone,
  part,
}: {
  start?: ProtoTime;
  timezone?: string;
  part: 'weekday' | 'day' | 'month';
}) {
  const [viewerTimezone, setViewerTimezone] = useState(timezone || 'UTC');

  useEffect(() => {
    setViewerTimezone(defaultTimezone());
  }, []);

  return <>{eventDateParts(start, viewerTimezone)?.[part] || ''}</>;
}
