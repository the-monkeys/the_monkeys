import Icon from '@/components/icon';
import { EventFaq as EventFaqItem } from '@/services/events/eventTypes';

/**
 * FAQ accordion built on native <details>/<summary> so it works without JS
 * and stays accessible on legacy browsers. Renders nothing when empty.
 */
export function EventFaq({ faqs }: { faqs?: EventFaqItem[] }) {
  if (!faqs?.length) return null;

  return (
    <section aria-labelledby='event-faq-heading'>
      <h2
        id='event-faq-heading'
        className='font-newsreader font-bold text-2xl md:text-3xl'
      >
        Frequently asked
      </h2>

      <div className='mt-4 divide-y divide-border-light dark:divide-border-dark/40 rounded-2xl border border-border-light dark:border-border-dark/60'>
        {faqs.map((faq, i) => (
          <details key={i} className='group px-5'>
            <summary className='flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-dm_sans font-medium marker:hidden [&::-webkit-details-marker]:hidden'>
              <span>{faq.question}</span>
              <Icon
                name='RiArrowDownS'
                size={20}
                className='shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180'
              />
            </summary>
            <div className='pb-4 font-inter text-[15px] leading-7 text-gray-600 dark:text-gray-300 whitespace-pre-wrap'>
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
