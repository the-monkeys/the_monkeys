import Icon from '@/components/icon';
import {
  eventLocationLabel,
  formatVenueAddress,
  mapQuery,
} from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';

/**
 * Interactive venue map. Uses an OpenStreetMap embed (no API key) and a
 * "Get directions" deep link. Hidden for purely virtual events with no venue.
 */
export function EventLocationMap({ event }: { event: EventItem }) {
  if (event.event_type === 'virtual' && !event.venue && !event.location) {
    return null;
  }

  const query = mapQuery(event);
  const label = eventLocationLabel(event);
  const address = formatVenueAddress(event.venue);
  const embedSrc = query
    ? `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${encodeURIComponent(
        query
      )}`
    : null;
  const directionsHref = query
    ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`
    : null;

  return (
    <section aria-labelledby='event-location-heading'>
      <h2
        id='event-location-heading'
        className='font-newsreader font-bold text-2xl md:text-3xl'
      >
        Location
      </h2>

      <div className='mt-4 overflow-hidden rounded-2xl border border-border-light dark:border-border-dark/60'>
        {embedSrc && (
          <iframe
            title='Event location map'
            src={embedSrc}
            loading='lazy'
            className='aspect-[16/9] w-full border-0 bg-foreground-light/30 dark:bg-foreground-dark/30'
            style={{ aspectRatio: '16 / 9' }}
            referrerPolicy='no-referrer-when-downgrade'
          />
        )}

        <div className='flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex min-w-0 items-start gap-3'>
            <Icon
              name='RiMapPinUser'
              size={20}
              className='mt-0.5 shrink-0 text-brand-orange'
            />
            <div className='min-w-0'>
              <p className='font-dm_sans font-medium'>
                {event.venue?.name || label || 'Venue to be announced'}
              </p>
              {address && (
                <p className='mt-0.5 font-inter text-sm text-gray-500 dark:text-gray-400'>
                  {address}
                </p>
              )}
            </div>
          </div>

          {directionsHref && (
            <a
              href={directionsHref}
              target='_blank'
              rel='noreferrer'
              className='inline-flex shrink-0 items-center gap-1 font-inter text-sm text-brand-orange hover:underline'
            >
              <Icon name='RiNavigation' size={16} />
              Get directions
            </a>
          )}
        </div>

        {event.how_to_find_us && (
          <div className='border-t border-border-light dark:border-border-dark/40 bg-brand-orange/5 p-5'>
            <p className='font-inter text-xs font-bold uppercase tracking-wider text-brand-orange'>
              How to find us
            </p>
            <p className='mt-1 font-inter text-sm leading-6 text-gray-600 dark:text-gray-300 whitespace-pre-wrap'>
              {event.how_to_find_us}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
