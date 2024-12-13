'use client';

import Image from 'next/image';

import SocialCard from '@/components/cards/SocialCard';
import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { toast } from '@/components/ui/use-toast';

const NotFound = () => {
  return (
    <Container className='pb-12 min-h-screen flex flex-col items-center space-y-6'>
      <div className='flex flex-wrap items-end justify-center gap-4'>
        <Image
          src={'/page-not-found.svg'}
          alt='Page not found'
          title='Page not found'
          height={250}
          width={250}
        />

        <div>
          <p className='font-dm_sans font-semibold text-center sm:text-left text-brand-orange'>
            Page Not Found
          </p>

          <p className='font-arvo text-3xl md:text-5xl text-center sm:text-left text-text-light dark:text-text-dark'>
            Lost your path?
          </p>
        </div>
      </div>

      <LinksRedirectArrow link='/' position='Left'>
        <p className='font-roboto'>Go back to home</p>
      </LinksRedirectArrow>

      <div className='w-full sm:w-4/5 md:w-1/2 space-y-2 px-5'>
        <SocialCard
          icon='RiDiscord'
          title='Join our Discord'
          text='Connect with fellow enthusiasts and stay updated.'
          link='https://discord.gg/6fK9YuV8FV'
        />

        <SocialCard
          icon='RiGithub'
          title='Explore on GitHub'
          text=' Explore our repositories and be part of the collaboration.'
          link='https://github.com/the-monkeys'
        />

        <SocialCard
          icon='RiTwitterX'
          title='Follow us on X'
          text='Stay in the loop with the latest updates.'
          link='https://twitter.com/TheMonkeysLife'
        />
      </div>
    </Container>
  );
};

export default NotFound;
