import Link from 'next/link';

import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { footerLinksList, footerSocialsList } from '@/constants/footer';
import { PARENT_COMPANY_ROUTE } from '@/constants/routeConstants';
import { cn } from '@/lib/utils';

type SidebarFooterProps = {
  collapsed?: boolean;
};

function SocialLinks() {
  return (
    <div className='flex items-center justify-center gap-2 mb-3'>
      {footerSocialsList.map((social) => (
        <a
          key={social.account}
          href={social.link}
          target='_blank'
          rel='noopener noreferrer'
          title={social.account}
          className='inline-flex h-7 w-7 items-center justify-center rounded-full text-text-light/60 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange dark:text-text-dark/60 dark:hover:bg-brand-orange/10'
        >
          <Icon name={social.icon} size={14} />
        </a>
      ))}
    </div>
  );
}

function LegalLinks() {
  const legal = footerLinksList.find((g) => g.heading === 'Legal');
  if (!legal) return null;
  return (
    <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-3'>
      {legal.items.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className='text-[9px] text-text-light/40 dark:text-text-dark/40 hover:text-brand-orange transition-colors'
        >
          {item.text}
        </Link>
      ))}
    </div>
  );
}

function Branding() {
  return (
    <div className='flex items-center justify-center gap-2'>
      <div className='w-4 flex justify-center items-center shrink-0'>
        <Logo />
      </div>
      <p className='text-[10px] font-normal text-text-light/40 dark:text-text-dark/40'>
        A product by{' '}
        <a
          href={PARENT_COMPANY_ROUTE}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-brand-orange transition-colors underline'
        >
          Buddhicintaka
        </a>
      </p>
    </div>
  );
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  return (
    <div
      className={cn(
        'shrink-0 pt-3 px-2 pb-4',
        !collapsed &&
          'border-t-[0.5px] border-border-light dark:border-border-dark'
      )}
    >
      {!collapsed && (
        // Collapsed: just show logo centered
        <>
          <SocialLinks />
          <LegalLinks />
          <Branding />
        </>
      )}
    </div>
  );
}

export default SidebarFooter;
