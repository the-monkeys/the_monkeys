import Image from 'next/image';

import Collaboration from './Collaboration';
import GridHeader from './GridHeader';
import GridTag from './GridTag';

const BentoGrid = () => {
  return (
    <div className='px-5 py-4 flex gap-2 md:gap-1 flex-col md:flex-row cursor-default'>
      <div className='w-full md:w-3/5 flex flex-col gap-2 md:gap-1'>
        <div className='flex-1 px-5 py-2 flex flex-col border-1 border-secondary-lightGrey/10 rounded-lg'>
          <GridTag title='Collaborative Writing' />

          <div className='flex flex-col md:flex-row gap-1'>
            <GridHeader
              title='Write together for impact'
              subheading='Enrich your content by inviting co-authors to add diverse perspectives and engage your audience.'
              className='w-full md:w-1/2'
            />

            <Collaboration />
          </div>
        </div>

        <div className='px-5 py-2 flex flex-col border-1 border-secondary-lightGrey/10 rounded-lg'>
          <GridTag
            title='Discover Diversity'
            className='self-end md:self-start'
          />

          <GridHeader
            title='Discover your interests with confidence'
            subheading='Navigate through a diverse array of categories tailored to your interests.'
            className='w-full text-right md:text-left'
          />

          <Image
            src='./topics_row_dark.svg'
            alt=''
            width={300}
            height={300}
            className='mt-4 w-full h-full hidden dark:block'
          />

          <Image
            src='./topics_row_light.svg'
            alt=''
            width={300}
            height={300}
            className='mt-4 w-full h-full block dark:hidden'
          />
        </div>
      </div>

      <div className='w-full md:w-2/5'>
        <div className='h-full px-5 py-2 flex flex-col border-1 border-secondary-lightGrey/10 rounded-lg'>
          <GridTag title='Version Control' className='self-start md:self-end' />

          <GridHeader
            title=' Tailor your content, your way'
            subheading='Easily personalize your blog by choosing versions that best represent your voice and vision.'
            className='text-left md:text-right'
          />

          <Image
            src='./version_branches.svg'
            alt=''
            width={300}
            height={300}
            className='mt-4 w-full h-full'
          />
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
