import Image from 'next/image';

import GridHeader from './GridHeader';
import GridTag from './GridTag';

const BentoGrid = () => {
  return (
    <div className='px-5 hidden md:grid grid-cols-4 gap-2 cursor-default'>
      <div className='p-4 row-span-2 col-span-4 lg:col-span-2 flex-1 flex flex-col border-1 border-secondary-lightGrey/15 rounded-lg'>
        <GridTag title='Collaborative Writing' />

        <div className='flex flex-row lg:flex-col gap-8'>
          <GridHeader
            title='Write together for impact'
            subheading='Enrich your content by inviting co-authors to add diverse perspectives and engage your audience.'
            className='mt-8'
          />

          <Image
            src='./collaborative_writing.svg'
            alt='Collaborative Writing'
            width={400}
            height={400}
            className='self-center'
          />
        </div>
      </div>

      <Image
        src='./version_control.svg'
        alt='Version Control'
        width={400}
        height={400}
        className='w-full col-span-2 rounded-lg'
      />

      <div className='p-4 col-span-2 flex flex-col border-1 border-secondary-lightGrey/15 rounded-lg'>
        <GridTag title='Version Control' className='self-end' />

        <GridHeader
          title=' Tailor your content, your way'
          subheading='Make your blog uniquely yours with multiple personalized versions.'
          className='mt-8 text-right'
        />
      </div>

      <div className='p-4 row-span-2 col-span-4 flex flex-col border-1 border-secondary-lightGrey/15 rounded-lg'>
        <GridTag title='Discover Diversity' />

        <div className='mt-8 flex flex-row gap-8'>
          <GridHeader
            title='Discover your interests with confidence'
            subheading='Navigate through a diverse array of categories tailored to your interests.'
            className='flex-1'
          />

          <Image
            src='./diversity_dark.svg'
            alt='Discover Diversity'
            width={400}
            height={400}
            className='hidden dark:block flex-1 w-1/2 lg:w-full rounded-lg'
          />

          <Image
            src='./diversity_light.svg'
            alt='Discover Diversity'
            width={400}
            height={400}
            className='block dark:hidden flex-1 w-1/2 lg:w-full rounded-lg'
          />
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
