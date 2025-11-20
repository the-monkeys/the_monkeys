import { BackgroundWaves } from '@/components/branding/BackgroundWaves';
import Icon from '@/components/icon';

const StaticText = () => {
  return (
    <div className='w-full sm:w-1/2 relative flex flex-col items-center sm:items-start gap-4 p-6'>
      <div className='absolute top-0 left-0 w-full h-full -z-10 opacity-80'>
        <BackgroundWaves />
      </div>

      <h2 className='text-4xl md:text-5xl font-dm_sans font-bold text-center sm:text-left'>
        Idea or Issue<span className='text-brand-orange'>?</span>&nbsp;
        <br />
        {`We're listening`}
        <span className='text-brand-orange'>!</span>
      </h2>

      <p className='pt-3 text-base sm:text-lg text-center sm:text-left tracking-tight'>
        {`Let's discuss partnerships, collaborations, or any support you need. `}
        <span className='font-medium'>Swing Us a Message!</span>
      </p>

      <div className='pt-8 w-full sm:w-11/12'>
        <ul className='space-y-4'>
          <li className='flex items-center sm:items-start gap-3'>
            <Icon
              name='RiLightbulbLine'
              type='NIL'
              className='w-6 h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-base sm:text-lg'>
              <span className='font-medium'>Suggest Topics:</span> Have an idea
              for a post? Let us know!
            </div>
          </li>
          <li className='flex items-center sm:items-start gap-3'>
            <Icon
              name='RiMessage3Line'
              type='NIL'
              className='w-6 h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-base sm:text-lg'>
              <span className='font-medium'>Share Feedback:</span> We love
              hearing your thoughts on our content and features.
            </div>
          </li>
          <li className='flex items-center sm:items-start gap-3'>
            <Icon
              name='RiBugLine'
              type='NIL'
              className='w-6 h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-base sm:text-lg'>
              <span className='font-medium'>Report Issues:</span> Found a bug or
              broken link? Help us make monkeys.com.co better.
            </div>
          </li>
          <li className='flex items-center sm:items-start gap-3'>
            <Icon
              name='RiMessageLine'
              type='NIL'
              className='w-6 h-6 text-brand-orange mt-1 flex-shrink-0'
            />
            <div className='text-base sm:text-lg'>
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
