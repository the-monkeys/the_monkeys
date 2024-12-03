import Link from 'next/link';

import Icon from '../icon';
import LinksRedirectArrow from '../links/LinksRedirectArrow';
import { Button } from '../ui/button';
import MonkeysBranding from './MonkeysBranding';

const HomeBanner = () => {
  return (
    <div className='relative flex flex-col justify-end gap-4 min-h-60 md:min-h-80'>
      <div className='absolute top-0 right-0 w-full sm:w-4/5 md:w-1/2 opacity-75 sm:opacity-100 -z-10 '>
        <MonkeysBranding />
      </div>

      <LinksRedirectArrow
        link='/news'
        position='Right'
        className='mx-auto md:m-0 w-fit'
      >
        <p className='font-dm_sans font-medium text-base sm:text-lg'>
          News by Monkeys
        </p>
      </LinksRedirectArrow>

      <h1 className='w-full md:w-4/5 font-playfair_Display font-medium text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm text-center md:text-left animate-appear-up'>
        Blog <span className='text-primary-monkeyOrange'>Together</span> Write{' '}
        <span className='text-primary-monkeyOrange'>Better</span>
      </h1>

      <p className='font-roboto text-base md:text-lg text-secondary-darkGrey dark:text-secondary-white text-center md:text-left'>
        Don't let outdated content overshadow your creation.
      </p>

      <div className='flex justify-center md:justify-start'>
        <Button size='lg' className='group px-4 sm:px-6 rounded-full' asChild>
          <Link href='/create' title='Create Blogs Here'>
            <Icon
              name='RiPencil'
              className='mr-2 group-hover:animate-icon-shake'
              type='Fill'
            />

            <p className='font-roboto'>Start Writing</p>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeBanner;
