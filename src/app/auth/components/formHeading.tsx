import Image from 'next/image';

const FormHeading = ({ heading }: { heading: string; className?: string }) => {
  return (
    <h1 className='font-arvo font-medium text-[28px] sm:text-3xl text-center sm:text-left'>
      {heading}
    </h1>
  );
};

const FormSubheading = ({
  subheading,
}: {
  subheading: string;
  className?: string;
}) => {
  return (
    <p className='font-dm_sans text-sm sm:text-base opacity-80 text-center sm:text-left'>
      {subheading}
    </p>
  );
};

const FormHeader = ({
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className='flex flex-col items-center sm:items-start gap-[4px]'>
      <div className='py-2 flex flex-col items-start gap-1'>
        <Image
          src={'/logo-brand.svg'}
          alt='Monkeys Logo'
          title='Monkeys Logo'
          height={22}
          width={52}
          className='drop-shadow-sm'
        />
      </div>
      {children}
    </div>
  );
};

export { FormHeader, FormHeading, FormSubheading };
