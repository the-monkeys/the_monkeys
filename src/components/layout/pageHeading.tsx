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
        'font-playfair_Display font-semibold text-3xl sm:text-4xl'
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
    <p className={twMerge(className, 'font-roboto text-sm sm:text-base')}>
      {subheading}
    </p>
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
    <div className={twMerge(className, 'px-4 py-2 flex flex-col items-center')}>
      {children}
    </div>
  );
};

export { PageHeader, PageHeading, PageSubheading };
