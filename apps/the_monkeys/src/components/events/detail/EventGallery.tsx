import Icon from '@/components/icon';

type Photo = { url: string; alt?: string };

/**
 * Community photo gallery. Shows an empty-state graphic until photos exist.
 * Images are lazy-loaded with an explicit aspect ratio to avoid layout shift.
 */
export function EventGallery({ photos }: { photos?: Photo[] }) {
  return (
    <section aria-labelledby='event-gallery-heading'>
      <h2
        id='event-gallery-heading'
        className='font-newsreader font-bold text-2xl md:text-3xl'
      >
        Photos
      </h2>

      {photos?.length ? (
        <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {photos.map((p, i) => (
            <div
              key={i}
              className='overflow-hidden rounded-xl bg-foreground-light/40 dark:bg-foreground-dark/30'
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src={p.url}
                alt={p.alt || ''}
                loading='lazy'
                className='h-full w-full object-cover'
              />
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light dark:border-border-dark/60 py-12 text-center'>
          <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <Icon name='RiCameraLens' size={26} />
          </div>
          <p className='font-dm_sans font-medium'>No photos for now!</p>
          <p className='mt-1 font-inter text-sm text-gray-500 dark:text-gray-400'>
            Photos shared by attendees will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
