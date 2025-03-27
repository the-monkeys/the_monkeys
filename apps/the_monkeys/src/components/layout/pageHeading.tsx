import { twMerge } from 'tailwind-merge';

const PageHeading = ({
  heading,
  className,
}: {
  heading: string;
  className?: string;
}) => {
  return (
    <h1 className={twMerge(className, 'pb-1 font-arvo text-3xl md:text-4xl')}>
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
    <p className={twMerge(className, 'font-dm_sans font-light text-sm')}>
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
    <div
      className={twMerge(className, 'p-4 flex flex-col items-center space-y-2')}
    >
      {children}
    </div>
  );
};

export { PageHeader, PageHeading, PageSubheading };
