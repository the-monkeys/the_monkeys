import Link from 'next/link';

import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';
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
        'flex flex-col sm:flex-row md:flex-col gap-6 items-start md:items-center border-1 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark'
      )}
    >
      <div className='w-full'>
        <h3 className='pb-2 font-dm_sans font-semibold text-base md:text-lg text-left'>
          Your support matters!
        </h3>

        <p className='text-sm'>
          Contribute features or improvements, or become a sponsor to help us
          grow sustainably and deliver value to the community.
        </p>
      </div>

      <div className='w-full flex-1 flex gap-2 flex-wrap'>
        <Button
          variant='outline'
          className='flex-1 border-blue-500/50 dark:border-blue-500/50 hover:bg-blue-500/25 dark:hover:bg-blue-500/25'
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
          className='flex-1 border-pink-500/50 dark:border-pink-500/50 hover:bg-pink-500/25 dark:hover:bg-pink-500/25'
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
