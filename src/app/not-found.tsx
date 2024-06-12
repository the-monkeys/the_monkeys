import Image from 'next/image';

import SocialCard from '@/components/cards/SocialCard';
import Container from '@/components/layout/container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

const NotFound = () => {
  return (
    <Container className='flex flex-col items-center space-y-6'>
      <div className='flex flex-wrap items-end justify-center gap-4'>
        <Image
          src={'/not-found.svg'}
          alt='Page not found'
          title='Page not found'
          height={250}
          width={250}
        />

        <div>
          <p className='font-josefin_Sans font-semibold text-center sm:text-left text-primary-monkeyOrange'>
            404: Page Not Found
          </p>

          <p className='font-playfair_Display text-3xl font-semibold md:text-5xl text-center sm:text-left text-secondary-darkGrey dark:text-secondary-white'>
            Lost your path?
          </p>
        </div>
      </div>

      <LinksRedirectArrow link='/' title='Go back to home' position='Left' />

      <p className='font-jost text-center'>Or</p>

      <div className='w-full sm:w-4/5 md:w-1/2 space-y-2'>
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
