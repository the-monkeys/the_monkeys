'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { footerList } from '@/constants/footer';
import { FEED_ROUTE } from '@/constants/routeConstants';
import {
  MONKEYS_DISCORD,
  MONKEYS_GITHUB,
  MONKEYS_INSTAGRAM,
  MONKEYS_X,
} from '@/constants/social';

import Container from '../Container';

const FooterList = ({
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
      <h4 className='font-dm_sans font-semibold text-base'>{heading}</h4>

      <ul className='space-y-[6px] sm:space-y-2'>
        {items.map((item, index) => (
          <li key={index}>
            <Link href={item.link} className='text-sm hover:underline'>
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
    <footer className='mt-20 border-t-2 border-border-light dark:border-border-dark'>
      <Container className='px-4 py-12 z-10'>
        <div className='grid grid-cols-3 gap-14 lg:gap-4'>
          <div className='col-span-3 lg:col-span-1 space-y-3'>
            <Link
              href={FEED_ROUTE}
              className='group flex items-center gap-[6px]'
            >
              <div className='size-12 flex justify-center items-center group-hover:opacity-80 transition-all'>
                <Logo />
              </div>

              <div className='pt-2'>
                <p className='font-dm_sans font-[450] tracking-tight text-[1.8rem]'>
                  Monkeys
                </p>
              </div>
            </Link>

            <p className='text-xs'>
              © 2025{' '}
              <span className='font-medium'>BUDDHICINTAKA PVT. LTD.</span> All
              rights reserved.
            </p>
          </div>

          <div className='col-span-3 lg:col-span-2 flex gap-10 justify-between lg:justify-end items-start flex-wrap'>
            {footerList.map((val, index) => {
              return (
                <FooterList
                  key={index}
                  heading={val.heading}
                  items={val.items}
                />
              );
            })}
          </div>
        </div>

        <div className='mt-16 flex justify-center items-center gap-3'>
          <Link href={MONKEYS_DISCORD} className='group'>
            <Icon
              name='RiDiscord'
              type='Fill'
              className='opacity-60 hover:opacity-100'
            />
          </Link>

          <Link href={MONKEYS_GITHUB} className='group'>
            <Icon
              name='RiGithub'
              size={24}
              type='Fill'
              className='opacity-60 hover:opacity-100'
            />
          </Link>

          <Link href={MONKEYS_X} className='group'>
            <Icon
              name='RiTwitterX'
              type='Fill'
              className='opacity-60 hover:opacity-100'
            />
          </Link>

          <Link href={MONKEYS_INSTAGRAM} className='group'>
            <Icon
              name='RiInstagram'
              type='Fill'
              className='opacity-60 hover:opacity-100'
            />
          </Link>
        </div>

        <div className='mt-5 flex justify-center gap-6'>
          <Link
            href='/terms'
            className='text-xs hover:underline underline-offset-1'
          >
            Terms
          </Link>
          <Link
            href='/privacy'
            className='text-xs hover:underline underline-offset-1'
          >
            Privacy
          </Link>
          <Link
            href='/cookies'
            className='text-xs hover:underline underline-offset-1'
          >
            Cookies
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
