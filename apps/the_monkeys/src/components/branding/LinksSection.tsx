import Link from 'next/link';

import { Button } from '@the-monkeys/ui/atoms/button';

import Icon from '../icon';

export const LinksSection = () => {
  return (
    <div className='mx-auto max-w-5xl px-4 grid grid-cols-2 gap-4 md:gap-6'>
      <div className='col-span-2 md:col-span-1 p-4 flex flex-col bg-foreground-light/25 dark:bg-foreground-dark/25 border-1 border-foreground-light dark:border-foreground-dark rounded-xl'>
        <h2 className='pb-2 font-dm_sans font-medium text-xl sm:text-2xl'>
          Monkeys{' '}
          <span className='font-dm_sans text-brand-orange'>Showcase</span>
        </h2>

        <p className='mb-4 sm:mb-6 text-sm md:text-base opacity-80'>
          Get a blend of the latest blogs and impactful news stories, all
          curated in one place for your convenience.
        </p>

        <Button
          variant='secondary'
          className='group w-fit pl-6 pr-4 self-end rounded-full'
          asChild
        >
          <Link href='/feed' title='Monkeys Showcase'>
            Discover
            <Icon
              name='RiArrowRight'
              size={16}
              className='mx-2 transition-all group-hover:ml-3 group-hover:mr-1'
            />
          </Link>
        </Button>
      </div>

      <div className='col-span-2 md:col-span-1 px-3 sm:px-4 py-4 sm:py-5 flex flex-col bg-foreground-light/25 dark:bg-foreground-dark/25 border-1 border-foreground-light dark:border-foreground-dark rounded-xl'>
        <h2 className='pb-2 font-dm_sans font-medium text-xl sm:text-2xl'>
          Diverse <span className='font-dm_sans text-brand-orange'>Topics</span>
        </h2>

        <p className='mb-4 sm:mb-6 text-sm md:text-base opacity-80'>
          With an ever-growing range of topics, there&apos;s always something
          fresh and exciting to explore.
        </p>

        <Button
          variant='secondary'
          className='group w-fit pl-6 pr-4 self-end rounded-full'
          asChild
        >
          <Link href='/topics/explore' title='Explore topics'>
            Explore
            <Icon
              name='RiArrowRight'
              size={16}
              className='mx-2 transition-all group-hover:ml-3 group-hover:mr-1'
            />
          </Link>
        </Button>
      </div>
    </div>
  );
};
