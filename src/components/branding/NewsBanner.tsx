import MonkeysBranding from './MonkeysBranding';

const NewsBanner = () => {
  return (
    <div className='relative min-h-80'>
      <h1 className='font-playfair_Display font-bold text-3xl sm:text-4xl md:text-5xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm text-center animate-appear-up'>
        Monkeys News
      </h1>

      <p className='font-jost text-base md:text-lg text-secondary-darkGrey dark:text-secondary-white text-center'>
        Stay up to date with events around{' '}
        <span className='font-medium underline'>Business</span>,{' '}
        <span className='font-medium underline'>Sports</span>,{' '}
        <span className='font-medium underline'>Technology</span> and many more.
      </p>
    </div>
  );
};

export default NewsBanner;
