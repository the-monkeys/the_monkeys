import { useRouter } from 'next/navigation';

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
        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm'>
          Seamless <span className='text-primary-monkeyOrange'>Creation</span>
        </h1>

        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm'>
          Effortless{' '}
          <span className='text-primary-monkeyOrange'>Collaboration</span>
        </h1>

        <p className='pt-6 font-jost text-sm sm:text-base md:text-lg'>
          Unleash Your Creativity and Influence: Blog Together, Write Better
        </p>

        <Button
          size='lg'
          className='px-4 sm:px-8 hover:shadow-lg hover:shadow-primary-monkeyOrange/50'
          onClick={() => {
            router.push('api/auth/signin');
          }}
        >
          <p className='font-jost'>Join Monkeys</p>
        </Button>
      </div>
    </div>
  );
};

export default HomeBanner;
