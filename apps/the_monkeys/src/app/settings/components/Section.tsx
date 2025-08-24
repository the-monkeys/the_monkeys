import { Badge } from '@the-monkeys/ui/atoms/badge';
import { twMerge } from 'tailwind-merge';

export const Section = ({
  sectionTitle,
  isDanger,
  children,
  upcoming = false,
}: {
  sectionTitle: string;
  isDanger?: boolean;
  children: React.ReactNode;
  upcoming?: boolean;
}) => {
  return (
    <div>
      <div className='w-full border-b-1 border-border-light dark:border-border-dark flex items-center gap-1'>
        <h3
          className={twMerge(
            isDanger && 'text-alert-red',
            'p-1 font-medium font-dm_sans text-lg'
          )}
        >
          {sectionTitle}
        </h3>

        {upcoming && (
          <Badge variant='brand' className='text-xs !px-2'>
            Upcoming
          </Badge>
        )}
      </div>

      <div className='mt-4'>{children}</div>
    </div>
  );
};
