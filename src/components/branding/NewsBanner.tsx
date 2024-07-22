import LinksRedirectArrow from '../links/LinksRedirectArrow';
import MonkeysBranding from './MonkeysBranding';

const NewsBanner = () => {
  const getGreeting = () => {
    const hours = new Date().getHours();

    if (hours < 12) {
      return 'Good morning! Fuel your day with curiosity and stay ahead with the latest updates!';
    } else if (hours < 18) {
      return 'Good afternoon! Keep your mind sharp and stay informed with the latest news!';
    } else {
      return 'Wishing you a peaceful evening filled with interesting information and updates!';
    }
  };

  return (
    <div className='relative flex flex-col justify-end gap-4 min-h-60 md:min-h-80'>
      <div className='absolute top-0 right-0 w-full sm:w-4/5 md:w-1/2 opacity-75 sm:opacity-100 -z-10 '>
        <MonkeysBranding />
      </div>

      <LinksRedirectArrow
        link='/'
        position='Left'
        className='mx-auto md:m-0 w-fit'
      >
        <p className='font-josefin_Sans font-medium text-base sm:text-lg'>
          Monkeys
        </p>
      </LinksRedirectArrow>

      <h1 className='w-full md:w-4/5 font-playfair_Display font-medium text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm text-center md:text-left animate-appear-up'>
        Global <span className='text-primary-monkeyOrange'>News</span> and{' '}
        <span className='text-primary-monkeyOrange'>Stock Market</span> Updates
      </h1>

      <p className='font-jost text-base md:text-lg text-secondary-darkGrey dark:text-secondary-white text-center md:text-left'>
        {getGreeting()}
      </p>
    </div>
  );
};

export default NewsBanner;
