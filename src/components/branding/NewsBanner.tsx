import MonkeysBranding from '@/components/branding/MonkeysBranding';
import { Badge } from '@/components/ui/badge';

const NewsBanner = () => {
  const getGreeting = () => {
    const hours = new Date().getHours();

    if (hours < 12) {
      return 'Good morning!';
    } else if (hours < 18) {
      return 'Good afternoon!';
    } else {
      return 'Good evening!';
    }
  };

  return (
    <div className='relative h-80'>
      <div className='flex justify-end opacity-75 sm:opacity-100'>
        <MonkeysBranding />
      </div>

      <div className='absolute bottom-0 left-0'>
        <Badge variant='secondary' className='w-fit animate-appear-up'>
          News by Monkeys
        </Badge>

        <h1 className='font-playfair_Display text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm cursor-default animate-appear-up'>
          Stay <span className='text-primary-monkeyOrange'>Informed</span>{' '}
          <br />
          Stay <span className='text-primary-monkeyOrange'>Ahead</span>
        </h1>

        <p className='mt-4 font-josefin_Sans text-base md:text-lg cursor-default'>
          {getGreeting()} Daily updates and insights on the latest headlines.
        </p>
      </div>
    </div>
  );
};

export default NewsBanner;
