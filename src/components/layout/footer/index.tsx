'use client';

import { useState } from 'react';

import Link from 'next/link';

import Button from '@/components/button';
import Icon from '@/components/icon';
import Input from '@/components/input';
import Logo from '@/components/logo';

import { footerList } from './footerList';
import List from './list';

const Footer = () => {
  const [userMail, setUserMail] = useState<string>('');

  /* Get the current year dynamically */
  const currentYear = new Date().getFullYear() 

  return (
    <footer className='flex flex-col gap-10 border-t-1 border-secondary-lightGrey/25 px-5 pb-4 pt-10'>
      <div className='item-start flex flex-col justify-between gap-10 md:flex-row md:items-end'>
        <div>
          <Logo showSubHeading showMix />
          <form className='mt-5 flex flex-wrap items-end gap-2 md:mt-10'>
            <Input
              className='w-full sm:w-60 md:w-64 text-sm sm:text-base'
              type='email'
              placeholderText='Your email address'
              setInputText={setUserMail}
              label='Get in Touch'
              variant='border'
            />
            <Button variant='primary' title='Subscribe' />
          </form>
        </div>

        <div className='flex flex-wrap justify-between gap-5'>
          {footerList.map((listItem, index) => {
            return <List listData={listItem} key={index} />;
          })}
        </div>
      </div>

      {/*Footer Icons*/}
      <div className='mb-14 flex w-fit flex-col items-center gap-2 self-center'>
        <div className='flex items-center justify-center gap-2'>
          <Link
            className='flex items-center gap-2'
            href='https://discord.gg/6fK9YuV8FV'
            target='_blank'
          >
            <Icon name='RiDiscordFill' size={20} />
          </Link>
          <Link
            className='flex items-center gap-2'
            href='https://github.com/the-monkeys'
            target='_blank'
          >
            <Icon name='RiGithubFill' size={20} />
          </Link>
          <Link
            className='flex items-center gap-2'
            href='https://twitter.com/TheMonkeysLife'
            target='_blank'
          >
            <Icon name='RiTwitterXFill' size={20} />
          </Link>
        </div>
        <p className='w-fit font-josefin_Sans text-xs text-secondary-lightGrey'>
          Monkeys, {currentYear}, All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
