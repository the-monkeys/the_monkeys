import Link from 'next/link';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';

export const ContributeAndSponsorCard = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        className,
        'p-4 flex flex-col sm:flex-row md:flex-col gap-4 items-start md:items-center border-1 border-border-light/25 dark:border-border-dark/25 rounded-xl'
      )}
    >
      <div className='w-full'>
        <h3 className='pb-1 font-dm_sans font-semibold text-base md:text-lg text-left'>
          Your support matters!
        </h3>

        <p className='text-sm opacity-80'>
          Contribute ideas or code, or sponsor us to help drive growth and
          impact.
        </p>
      </div>

      <div className='w-full flex-1 flex gap-2 flex-wrap'>
        <Button
          variant='outline'
          className='flex-1 rounded-full border-blue-500/25 dark:border-blue-500/25 hover:bg-blue-500/25 dark:hover:bg-blue-500/25'
          asChild
        >
          <Link
            href='https://github.com/the-monkeys/the_monkeys'
            target='_blank'
          >
            <Icon name='RiCodeSSlash' className='mr-1 text-blue-500' />
            Contribute
          </Link>
        </Button>

        <Button
          variant='outline'
          className='flex-1 rounded-full border-pink-500/25 dark:border-pink-500/25 hover:bg-pink-500/25 dark:hover:bg-pink-500/25'
          asChild
        >
          <Link href='https://github.com/sponsors/the-monkeys' target='_blank'>
            <Icon name='RiShakeHands' className='mr-1 text-pink-500' />
            Sponsor
          </Link>
        </Button>
      </div>
    </div>
  );
};
