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
      <h4 className='font-semibold text-sm md:text-base'>{heading}</h4>

      <ul className='space-y-[6px] sm:space-y-2'>
        {items.map((item, index) => (
          <li key={index}>
            <Link
              href={item.link}
              className='font-light text-sm md:text-base hover:underline'
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
    <footer className='bg-brand-orange text-white mt-20 overflow-hidden'>
      <div className='flex'>
        <div className='flex-[2] h-[50px] bg-black opacity-20' />
        <div className='flex-[1] h-[50px] bg-black opacity-10' />
      </div>

      <Container className='px-4 pt-10 pb-12 z-10'>
        <div className='grid grid-cols-3 gap-14 lg:gap-4'>
          <div className='col-span-3 lg:col-span-1 space-y-3'>
            <Link
              href={FEED_ROUTE}
              className='group flex items-center gap-[6px]'
            >
              <div className='size-12 md:size-14 flex justify-center items-center filter brightness-50 group-hover:brightness-[.6] transition-all'>
                <Logo />
              </div>

              <div className='pt-3'>
                <p className='font-dm_sans font-medium text-3xl md:text-4xl'>
                  Monkeys
                </p>
              </div>
            </Link>

            <p className='text-xs text-text-dark'>
              © 2025 BUDDHICINTAKA PVT. LTD. All rights reserved.
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
              className='text-black/50 group-hover:text-black/70'
            />
          </Link>

          <Link href={MONKEYS_GITHUB} className='group'>
            <Icon
              name='RiGithub'
              size={24}
              type='Fill'
              className='text-black/50 group-hover:text-black/70'
            />
          </Link>

          <Link href={MONKEYS_X} className='group'>
            <Icon
              name='RiTwitterX'
              type='Fill'
              className='text-black/50 group-hover:text-black/70'
            />
          </Link>

          <Link href={MONKEYS_INSTAGRAM} className='group'>
            <Icon
              name='RiInstagram'
              type='Fill'
              className='text-black/50 group-hover:text-black/70'
            />
          </Link>
        </div>

        <div className='mt-6 flex justify-center gap-6'>
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
