import { useRouter } from 'next/navigation';

import Icon from '../icon';
import { Button } from '../ui/button';
import BackgroundBranding from './BackgroundBranding';

const HomeBanner = () => {
  const router = useRouter();

  return (
    <div className='relative h-80'>
      <div className='flex justify-end opacity-75 sm:opacity-100'>
        <BackgroundBranding />
      </div>

      <div className='absolute bottom-0 left-0 space-y-2'>
        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm cursor-default'>
          Seamless <span className='text-primary-monkeyOrange'>Creation</span>
        </h1>

        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm cursor-default'>
          Effortless{' '}
          <span className='text-primary-monkeyOrange'>Collaboration</span>
        </h1>

        <p className='pt-6 font-jost font-light text-base md:text-lg cursor-default'>
          Unleash Your Creativity and Influence: Blog Together, Write Better
        </p>

        <Button
          size='lg'
          className='group px-4 sm:px-6 hover:shadow-lg hover:shadow-primary-monkeyOrange/50 rounded-full'
          onClick={() => {
            router.push('api/auth/signin');
          }}
        >
          <Icon
            name='RiPencil'
            className='mr-2 group-hover:animate-shake'
            type='Fill'
          />

          <p className='font-jost'>Start Writing</p>
        </Button>
      </div>
    </div>
  );
};

export default HomeBanner;
