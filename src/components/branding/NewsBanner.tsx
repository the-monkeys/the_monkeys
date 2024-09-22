import LinksRedirectArrow from '../links/LinksRedirectArrow';
import MonkeysBranding from './MonkeysBranding';

const NewsBanner = () => {
  return (
    <div className='relative flex flex-col justify-end gap-4'>
      <h1 className='w-full md:w-4/5 font-playfair_Display font-medium text-4xl sm:text-5xl md:text-6xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm text-center md:text-left animate-appear-up'>
        Latest <span className='text-primary-monkeyOrange'>News</span> and
        Global <span className='text-primary-monkeyOrange'>Headlines</span>
      </h1>

      <p className='font-jost text-base md:text-lg text-secondary-darkGrey dark:text-secondary-white text-center md:text-left'>
        Stay up to date with events in{' '}
        <span className='font-medium underline'>Business</span>,{' '}
        <span className='font-medium underline'>Sports</span>,{' '}
        <span className='font-medium underline'>Politics</span>,{' '}
        <span className='font-medium underline'>Technology</span>,{' '}
        <span className='font-medium underline'>Stock Market</span> and many
        more.
      </p>
    </div>
  );
};

export default NewsBanner;
