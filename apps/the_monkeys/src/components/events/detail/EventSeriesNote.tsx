import Icon from '@/components/icon';
import { EventItem } from '@/services/events/eventTypes';

/**
 * Read-only indicator that an event is part of a recurring series. The backend
 * exposes series metadata on the event but offers no series-editing API yet, so
 * this is display-only and renders nothing when the event is a one-off.
 */
export function EventSeriesNote({ event }: { event: EventItem }) {
  const label = event.recurrence_text?.trim();
  const isSeries = !!label || typeof event.series_id === 'number';
  if (!isSeries) return null;

  return (
    <span className='inline-flex items-center gap-1 text-gray-500'>
      <Icon name='RiHistory' size={16} />
      {label || 'Part of a recurring series'}
    </span>
  );
}
