import { Button } from '../ui/button';
import BackgroundBranding from './BackgroundBranding';

const HomeBanner = () => {
  return (
    <div className='relative h-80'>
      <div className='flex justify-end opacity-75 sm:opacity-100'>
        <BackgroundBranding />
      </div>

      <div className='absolute bottom-0 left-0 space-y-2'>
        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl drop-shadow-md'>
          Seamless <span className='text-primary-monkeyOrange'>Creation</span>
        </h1>

        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl drop-shadow-md'>
          Effortless{' '}
          <span className='text-primary-monkeyOrange'>Collaboration</span>
        </h1>

        <p className='pt-6 font-josefin_Sans text-base sm:text-lg'>
          Unleash Your Creativity and Influence: Blog Together, Write Better
        </p>

        <Button size='lg' className='px-8'>
          <p className='font-jost'>Join Monkeys</p>
        </Button>
      </div>
    </div>
  );
};

export default HomeBanner;
