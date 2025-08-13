import Link from 'next/link';

import { CREATE_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';

import Icon from '../icon';
import { BackgroundBanner } from './BackgroundBanner';

const HomeBanner = () => {
  return (
    <div className='py-6 px-4 relative flex flex-col justify-center items-center min-h-60 md:min-h-80'>
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-full w-full -z-10'>
        <BackgroundBanner />
      </div>

      <h1 className='pb-2 md:pb-4 font-dm_sans font-medium text-[30px] sm:text-[40px] md:text-[50px] drop-shadow-sm text-center leading-10 animate-appear-up'>
        Inspire, Inform, Innovate
      </h1>

      <p className='text-base sm:text-lg md:text-xl text-center opacity-90 animate-appear-up'>
        Come together and write content that connect, inspire, and leave a
        lasting impact.
      </p>

      <div className='mt-6 md:mt-8 flex justify-center sm:justify-start items-center flex-wrap gap-2'>
        <Button
          size='lg'
          variant='brand'
          className='group px-6 rounded-full hover:text-text-dark hover:bg-opacity-100 shadow-sm'
          title='Create Post'
          asChild
        >
          <Link href={`${CREATE_ROUTE}`}>
            <div>
              <Icon
                name='RiPencil'
                className='mr-2 group-hover:animate-icon-shake'
              />
            </div>
            <p className='font-dm_sans'>Start Writing</p>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeBanner;
