import Icon from '@/components/icon';

export function BlogAudienceBadge() {
  return (
    <span className='inline-flex min-h-6 shrink-0 items-center gap-1 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-2 py-0.5 font-inter text-[11px] font-semibold text-brand-orange'>
      <span aria-hidden>
        <Icon name='RiLock' size={12} />
      </span>
      Members only
    </span>
  );
}
