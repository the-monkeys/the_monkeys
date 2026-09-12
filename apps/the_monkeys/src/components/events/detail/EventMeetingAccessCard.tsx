import Icon from '@/components/icon';

export function EventMeetingAccessCard({
  meetingLink,
}: {
  meetingLink?: string;
}) {
  if (!meetingLink) return null;

  return (
    <a
      href={meetingLink}
      target='_blank'
      rel='noreferrer'
      className='group flex min-h-20 w-full items-center gap-3 rounded-xl border border-emerald-600/30 bg-emerald-600/[0.07] p-4 transition-colors hover:border-emerald-600/45 hover:bg-emerald-600/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15'
    >
      <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'>
        <Icon name='RiLinks' size={21} />
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block font-dm_sans font-semibold text-emerald-900 dark:text-emerald-200'>
          Join online event
        </span>
        <span className='mt-0.5 block font-inter text-sm leading-5 text-gray-600 dark:text-gray-400'>
          Your access is confirmed. Open the meeting link when you are ready.
        </span>
      </span>
      <Icon
        name='RiArrowRightUp'
        size={18}
        className='shrink-0 text-emerald-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-emerald-300'
      />
    </a>
  );
}
