import Icon from '@/components/icon';
import { EventItem } from '@/services/events/eventTypes';

/**
 * Read-only indicator that an event is part of a recurring series.
 * Renders nothing when the event is a one-off.
 */
export function EventSeriesNote({
  event,
  className,
}: {
  event: EventItem;
  className?: string;
}) {
  const label = event.recurrence_text?.trim();
  const isSeries =
    !!label || (typeof event.series_id === 'number' && event.series_id > 0);
  if (!isSeries) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-gray-500 ${className ?? ''}`.trim()}
    >
      <Icon name='RiHistory' size={16} />
      {label || 'Part of a recurring series'}
    </span>
  );
}
