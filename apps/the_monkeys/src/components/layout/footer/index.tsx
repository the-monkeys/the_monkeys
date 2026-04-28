import Link from 'next/link';

import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { footerLinksList, footerSocialsList } from '@/constants/footer';
import { PARENT_COMPANY_ROUTE } from '@/constants/routeConstants';

function SocialLinks() {
  return (
    <div className='flex items-center justify-center gap-4 mb-4'>
      {footerSocialsList.map((social) => (
        <a
          key={social.account}
          href={social.link}
          target='_blank'
          rel='noopener noreferrer'
          title={social.account}
          className='inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 transition-all hover:bg-brand-orange/10 hover:text-brand-orange'
        >
          <Icon name={social.icon} size={18} />
        </a>
      ))}
    </div>
  );
}

function LegalLinks() {
  const legalGroup = footerLinksList.find((g) => g.heading === 'Legal');
  const companyGroup = footerLinksList.find((g) => g.heading === 'Company');
  const legal =
    legalGroup && companyGroup
      ? { items: [...companyGroup.items, ...legalGroup.items] }
      : legalGroup || companyGroup;
  if (!legal) return null;
  return (
    <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4'>
      {legal.items.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className='text-xs text-text-light/40 dark:text-text-dark/40 hover:text-brand-orange transition-colors'
        >
          {item.text}
        </Link>
      ))}
    </div>
  );
}

function Branding() {
  return (
    <div className='flex items-center justify-center gap-2 mt-2 opacity-60 hover:opacity-100 transition-opacity'>
      <div className='w-5 flex justify-center items-center shrink-0 grayscale hover:grayscale-0 transition-all'>
        <Logo />
      </div>
      <p className='text-[10px] font-inter font-medium text-gray-500 dark:text-gray-400'>
        A product by{' '}
        <a
          href={PARENT_COMPANY_ROUTE}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-brand-orange transition-colors underline underline-offset-2'
        >
          Buddhicintaka
        </a>
      </p>
    </div>
  );
}

function Company() {
  const company = footerLinksList.find((g) => g.heading === 'Company');
  if (!company) return null;
  return (
    <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-3'>
      {company.items.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className='text-xs text-text-light/40 dark:text-text-dark/40 hover:text-brand-orange transition-colors'
        >
          {item.text}
        </Link>
      ))}
    </div>
  );
}

export function SidebarFooter() {
  return (
    <div className='shrink-0  px-2 pb-2'>
      <div className='hidden md:block'>
        <SocialLinks />
        {/* <Company/> */}
        <LegalLinks />
        <Branding />
      </div>
    </div>
  );
}

export default SidebarFooter;
