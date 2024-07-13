import Link from 'next/link';

import Icon from '../icon';
import { Button } from '../ui/button';
import MonkeysBranding from './MonkeysBranding';

const HomeBanner = () => {
  return (
    <div className='relative h-80'>
      <div className='flex justify-end opacity-75 sm:opacity-100'>
        <MonkeysBranding />
      </div>

      <div className='absolute bottom-0 left-0 space-y-2'>
        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm cursor-default animate-appear-up'>
          Seamless <span className='text-primary-monkeyOrange'>Creation</span>{' '}
          <br />
          Effortless{' '}
          <span className='text-primary-monkeyOrange'>Collaboration</span>
        </h1>

        <p className='pt-6 font-jost text-base md:text-lg cursor-default'>
          Unleash Your Creativity and Influence: Blog Together, Write Better
        </p>

        <Button
          size='lg'
          className='group px-4 sm:px-6 hover:shadow-lg hover:shadow-primary-monkeyOrange/50 hover:text-primary-monkeyBlack dark:hover:text-primary-monkeyWhite rounded-full'
          asChild
        >
          <Link href='/create'>
            <Icon
              name='RiPencil'
              className='mr-2 group-hover:animate-icon-shake'
              type='Fill'
            />

            <p className='font-jost'>Start Writing</p>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeBanner;
