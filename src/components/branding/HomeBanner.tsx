import Link from 'next/link';

import Icon from '../icon';
import { Button } from '../ui/button';
import MonkeysBranding from './MonkeysBranding';

const HomeBanner = () => {
  return (
    <div className='py-6 px-4 relative flex flex-col justify-center items-center min-h-60 md:min-h-80'>
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-full w-full -z-10'>
        <MonkeysBranding />
      </div>

      <h1 className='pb-2 md:pb-4 font-arvo font-medium text-[30px] sm:text-[40px] md:text-[50px] drop-shadow-sm text-center leading-10 animate-appear-up'>
        Inspire, Inform, Innovate
      </h1>

      <p className='font-dm_sans font-light text-base sm:text-lg md:text-xl text-center opacity-80 animate-appear-up'>
        Blog together and write content that connect, inspire, and leave a
        lasting impact.
      </p>

      <div className='mt-6 md:mt-8 flex justify-center sm:justify-start items-center flex-wrap gap-2'>
        <Button
          size='lg'
          variant='brand'
          className='group px-6 rounded-full hover:text-text-dark hover:bg-opacity-100 shadow-md'
          asChild
        >
          <Link href='/create' title='Create'>
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
