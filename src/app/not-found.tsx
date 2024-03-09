import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import SocialCard from '@/components/notFound/SocialCard';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className='mb-20 flex h-fit flex-col items-center gap-10 px-5'>
      <div className='mt-10 flex flex-wrap items-center justify-center gap-10'>
        <Image
          // className='hidden sm:block'
          src={'/not-found.svg'}
          alt='Page not found'
          title='Page not found'
          height={50}
          width={200}
        />

        <div>
          <p className='font-josefin_Sans text-xs font-semibold text-primary-monkeyOrange sm:text-sm md:text-base'>
            ERROR 404
          </p>
          <p className='font-playfair_Display text-3xl font-semibold md:text-5xl'>
            Looks like
            <br /> you have lost <br />
            your path
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col items-start gap-5 sm:w-4/5 md:w-1/2'>
        <SocialCard
          icon='RiDiscordFill'
          title='Join our Discord'
          text='Connect with fellow enthusiasts and stay updated.'
          link='https://discord.gg/HTuz82d8'
        />
        <SocialCard
          icon='RiGithubFill'
          title='Explore on GitHub'
          text=' Explore our repositories and be part of the collaboration.'
          link='https://github.com/the-monkeys'
        />
        <SocialCard
          icon='RiTwitterXFill'
          title='Follow us on X'
          text='Stay in the loop with the latest updates.'
          link='https://twitter.com/TheMonkeysLife'
        />
      </div>

      <LinksRedirectArrow target='/' title='Or go back to home' />
    </div>
  );
};

export default NotFound;
