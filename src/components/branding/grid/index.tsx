import Image from 'next/image';

import GridHeader from './GridHeader';
import GridTag from './GridTag';

const BentoGrid = () => {
  return (
    <div className='px-5 flex gap-2 flex-col md:flex-row cursor-default'>
      <div className='w-full md:w-3/5 flex flex-col gap-2'>
        <div className='p-4 flex flex-col border-1 border-secondary-lightGrey/15 rounded-lg'>
          <GridTag title='Collaborative Writing' />

          <div className='mt-4 items-start flex flex-col md:flex-row gap-4'>
            <GridHeader
              title='Write together for impact'
              subheading='Enrich your content by inviting co-authors to add diverse perspectives and engage your audience.'
              className='w-full md:w-3/5'
            />

            <div className='hidden md:block'>
              <Image
                src='./collaborative_writing.svg'
                alt='Version Control'
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>

        <div className='p-4 flex flex-col border-1 border-secondary-lightGrey/15 rounded-lg'>
          <GridTag
            title='Discover Diversity'
            className='self-end md:self-start'
          />

          <GridHeader
            title='Discover your interests with confidence'
            subheading='Navigate through a diverse array of categories tailored to your interests.'
            className='mt-4 w-full text-right md:text-left'
          />

          <div className='mt-4 hidden md:block'>
            <Image
              src='./diversity_dark.svg'
              alt='Version Control'
              width={400}
              height={400}
              className='w-full hidden dark:block'
            />

            <Image
              src='./diversity_light.svg'
              alt='Version Control'
              width={400}
              height={400}
              className='w-full block dark:hidden'
            />
          </div>
        </div>
      </div>

      <div className='w-full md:w-2/5'>
        <div className='p-5 py-4 flex flex-col border-1 border-secondary-lightGrey/15 rounded-lg'>
          <GridTag title='Version Control' className='self-start md:self-end' />

          <GridHeader
            title=' Tailor your content, your way'
            subheading='Easily personalize your blog by choosing versions that best represent your voice and vision.'
            className='mt-4 text-left md:text-right'
          />

          <div className='mt-4 self-center hidden md:block'>
            <Image
              src='./version_control.svg'
              alt='Version Control'
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
