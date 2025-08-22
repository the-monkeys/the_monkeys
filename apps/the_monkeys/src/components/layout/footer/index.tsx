import Link from 'next/link';

import Icon, { IconName } from '@/components/icon';
import Logo from '@/components/logo';
import { footerLinksList, footerSocialsList } from '@/constants/footer';
import { FEED_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';

import Container from '../Container';

const FooterSocialLink = ({
  social,
}: {
  social: { account: string; icon: IconName; link: string };
}) => {
  return (
    <Button
      variant='outline'
      size='icon'
      className='group !border-1 rounded-full'
      asChild
    >
      <Link target='_blank' href={social.link}>
        <Icon
          name={social.icon}
          type='Fill'
          className='opacity-80 group-hover:opacity-100'
        />
      </Link>
    </Button>
  );
};

const FooterLinksList = ({
  heading,
  items,
}: {
  heading: string;
  items: {
    text: string;
    link: string;
  }[];
}) => {
  return (
    <div className='min-w-[140px] space-y-4'>
      <h4 className='font-dm_sans font-medium text-lg'>{heading}</h4>

      <ul className='space-y-[6px] sm:space-y-2'>
        {items.map((item, index) => (
          <li key={index}>
            <Link
              target='_blank'
              href={item.link}
              className='text-sm hover:underline opacity-90'
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className='mt-20 border-t-1 border-border-light dark:border-border-dark'>
      <Container className='px-4 py-14 z-10'>
        <div className='grid grid-cols-3 gap-14 lg:gap-4'>
          <div className='col-span-3 lg:col-span-1 space-y-2'>
            <Link
              href={FEED_ROUTE}
              className='group w-fit flex items-center gap-[6px]'
            >
              <div className='size-10 flex justify-center items-center filter group-hover:brightness-90'>
                <Logo />
              </div>

              <div className='pt-2'>
                <p className='font-dm_sans font-medium tracking-tight text-[27.8px] group-hover:opacity-90'>
                  Monkeys
                </p>
              </div>
            </Link>

            <p className='text-xs'>
              A product of{' '}
              <span className='font-medium'>BUDDHICINTAKA PVT. LTD.</span>
            </p>

            <div className='py-6 flex flex-wrap gap-2'>
              {footerSocialsList.map((val, index) => {
                return <FooterSocialLink key={index} social={val} />;
              })}
            </div>
          </div>

          <div className='col-span-3 lg:col-span-2 flex gap-12 justify-between lg:justify-end items-start flex-wrap'>
            {footerLinksList.map((val, index) => {
              return (
                <FooterLinksList
                  key={index}
                  heading={val.heading}
                  items={val.items}
                />
              );
            })}
          </div>
        </div>

        <div className='mt-12 flex justify-center items-center gap-4 flex-wrap'>
          <div className='w-full mx-auto'>
            <p className='py-6 font-medium text-xs text-center'>
              <span className='font-normal'>© 2025</span> BUDDHICINTAKA PVT.
              LTD. <span className='font-normal'>All rights reserved.</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
