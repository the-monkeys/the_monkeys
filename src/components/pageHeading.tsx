const PageHeading = ({
  heading,
  subHeading,
  badge,
}: {
  heading: string;
  subHeading?: string;
  badge?: JSX.Element;
}) => {
  return (
    <div className='px-4 py-2 flex flex-col items-center space-y-2'>
      {badge}

      <h1 className='font-playfair_Display font-semibold text-3xl sm:text-4xl text-center cursor-default'>
        {heading}
      </h1>

      {subHeading && (
        <p className='font-jost text-sm sm:text-base text-center text-secondary-darkGrey dark:text-secondary-white'>
          {subHeading}
        </p>
      )}
    </div>
  );
};

export default PageHeading;
