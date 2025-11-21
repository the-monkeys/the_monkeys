import { BackgroundWaves } from '@/components/branding/BackgroundWaves';
import Icon from '@/components/icon';

const StaticText = () => {
  return (
    <div className='w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-4 sm:gap-6 p-4 sm:p-6'>
      <div className='relative w-full'>
        <div className='absolute top-0 left-0 w-full h-full -z-10 opacity-90'>
          <BackgroundWaves />
        </div>

        <h2 className='text-3xl sm:text-4xl md:text-5xl font-dm_sans font-bold text-center leading-normal'>
          Idea or Issue<span className='text-brand-orange'>?</span>&nbsp;
          <br />
          {`We're listening`}
          <span className='text-brand-orange'>!</span>
        </h2>

        <p className='pt-3 sm:pt-4 text-sm sm:text-base md:text-lg text-center tracking-tight leading-snug'>
          {`Let's discuss partnerships, collaborations, or any support you need. `}
          <span className='font-medium'>Swing Us a Message!</span>
        </p>
      </div>

      <div className='pt-6 sm:pt-8 w-full lg:w-11/12'>
        <ul className='space-y-3 sm:space-y-4'>
          <li className='w-full flex items-start justify-center gap-2 sm:gap-3'>
            <Icon
              name='RiLightbulbLine'
              type='NIL'
              className='w-5 h-5 sm:w-6 sm:h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-sm sm:text-base md:text-lg'>
              <span className='font-medium'>Suggest Topics:</span> Have an idea
              for a post? Let us know!
            </div>
          </li>
          <li className='w-full flex items-start justify-center gap-2 sm:gap-3'>
            <Icon
              name='RiMessage3Line'
              type='NIL'
              className='w-5 h-5 sm:w-6 sm:h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-sm sm:text-base md:text-lg'>
              <span className='font-medium'>Share Feedback:</span> We love
              hearing your thoughts on our content and features.
            </div>
          </li>
          <li className='w-full flex items-start justify-center gap-2 sm:gap-3'>
            <Icon
              name='RiBugLine'
              type='NIL'
              className='w-5 h-5 sm:w-6 sm:h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-sm sm:text-base md:text-lg'>
              <span className='font-medium'>Report Issues:</span> Found a bug or
              broken link? Help us make monkeys better.
            </div>
          </li>
          <li className='w-full flex items-start justify-center gap-2 sm:gap-3'>
            <Icon
              name='RiMessageLine'
              type='NIL'
              className='w-5 h-5 sm:w-6 sm:h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-sm sm:text-base md:text-lg'>
              <span className='font-medium'>General Enquiries:</span> For
              anything else, our team is happy to help.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StaticText;
