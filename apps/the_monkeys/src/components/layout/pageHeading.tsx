import { twMerge } from 'tailwind-merge';

const PageHeading = ({
  heading,
  className,
}: {
  heading: string;
  className?: string;
}) => {
  return (
    <h1
      className={twMerge(
        className,
        'pb-1 font-dm_sans font-semibold text-3xl md:text-4xl'
      )}
    >
      {heading}
    </h1>
  );
};

const PageSubheading = ({
  subheading,
  className,
}: {
  subheading: string;
  className?: string;
}) => {
  return (
    <p className={twMerge(className, 'text-sm opacity-90')}>{subheading}</p>
  );
};

const PageHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        className,
        'px-4 py-8 flex flex-col items-center space-y-2'
      )}
    >
      {children}
    </div>
  );
};

export { PageHeader, PageHeading, PageSubheading };
