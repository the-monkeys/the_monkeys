import { twMerge } from 'tailwind-merge';

export const GridHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={twMerge(
        className,
        'font-playfair_Display font-medium text-xl sm:text-2xl cursor-default'
      )}
    >
      {children}
    </h2>
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
          'my-2 font-jost text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default')
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
        'group flex-1 px-2 sm:px-4 py-4 pb-0 border-1 border-secondary-lightGrey/25 rounded-lg'
      )}
    >
      {children}
    </div>
  );
};
