import { twMerge } from 'tailwind-merge';

export const GridHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={twMerge(
        className,
        'font-josefin_Sans font-semibold text-lg cursor-default'
      )}
    >
      {children}
    </p>
  );
};
export const GridSubHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={twMerge(
        className,
        (className =
          'font-jost text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default')
      )}
    >
      {children}
    </p>
  );
};

export const GridContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        className,
        'group flex-1 p-4 border-1 border-secondary-lightGrey/15 rounded-lg'
      )}
    >
      {children}
    </div>
  );
};
