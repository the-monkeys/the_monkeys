const FormHeading = ({ heading }: { heading: string; className?: string }) => {
  return (
    <h1 className='font-dm_sans font-medium text-3xl sm:text-4xl text-center'>
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
  return <p className='text-sm text-center opacity-90'>{subheading}</p>;
};

const FormHeader = ({
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className='p-6 flex flex-col items-center gap-2'>{children}</div>;
};

export { FormHeader, FormHeading, FormSubheading };
