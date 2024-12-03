import { twMerge } from 'tailwind-merge';

export const GridHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={twMerge(className, 'font-dm_sans text-xl sm:text-2xl')}>
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
        (className = 'font-roboto leading-tight opacity-75')
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
        'group border-1 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/50 rounded-md overflow-hidden'
      )}
    >
      {children}
    </div>
  );
};
