'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { footerList } from '@/constants/footer';
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
      <h4 className='font-dm_sans font-semibold text-sm sm:text-base'>
        {heading}
      </h4>

      <ul className='space-y-2'>
        {items.map((item, index) => (
          <li key={index}>
            <Link
              href={item.link}
              className='text-xs sm:text-sm hover:underline'
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
    <footer className='relative bg-brand-orange text-white mt-20 overflow-hidden'>
      <div className='flex'>
        <div className='flex-[2] h-[50px] bg-black opacity-20' />
        <div className='flex-[1] h-[50px] bg-black opacity-10' />
      </div>

      <div className='absolute -bottom-[20px] right-0 size-[320px] md:size-[420px] filter brightness-95'>
        <Logo />
      </div>

      <Container className='relative px-4 pt-8 pb-12 z-10'>
        <div className='grid grid-cols-3 gap-10'>
          <div className='col-span-3 md:col-span-1 space-y-3'>
            <h5 className='font-dm_sans font-medium text-3xl md:text-4xl'>
              Monkeys
            </h5>

            <p className='text-xs text-text-dark'>
              © 2025 BUDDHICINTAKA PVT. LTD. All rights reserved.
            </p>
          </div>

          <div className='col-span-3 md:col-span-2 flex gap-12 md:justify-end items-start'>
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
            Privacy Policy
          </Link>
          <Link
            href='/cookies'
            className='text-xs hover:underline underline-offset-1'
          >
            Cookie Policy
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
