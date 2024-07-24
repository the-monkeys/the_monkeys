const PageHeading = ({
  heading,
  subHeading,
  badge,
}: {
  heading: string;
  subHeading?: JSX.Element;
  badge?: JSX.Element;
}) => {
  return (
    <div className='px-4 py-2 flex flex-col items-center'>
      {badge}

      <h1 className='mt-2 font-playfair_Display font-semibold text-3xl sm:text-4xl text-center cursor-default'>
        {heading}
      </h1>

      {subHeading}
    </div>
  );
};

export default PageHeading;
