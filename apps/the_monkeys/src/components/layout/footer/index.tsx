import Link from 'next/link';

import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { footerLinksList, footerSocialsList } from '@/constants/footer';
import { PARENT_COMPANY_ROUTE } from '@/constants/routeConstants';

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

export function SidebarFooter() {
  return (
    <div className='shrink-0 border-t-[0.5px] border-border-light dark:border-border-dark pt-3 px-2 pb-4'>
      {/* Expanded state: Desktop and larger tablets */}
      <div className='hidden md:block'>
        <SocialLinks />
        <LegalLinks />
        <Branding />
      </div>

      {/* Collapsed state: Mobile and small tablets */}
      <div className='md:hidden flex flex-col items-center justify-center p-1'>
        <div className='w-5 h-5 flex justify-center items-center opacity-50 contrast-0 grayscale'>
          <Logo />
        </div>
      </div>
    </div>
  );
}

export default SidebarFooter;
