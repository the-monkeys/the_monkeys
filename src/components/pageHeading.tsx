const PageHeading = ({
  heading,
  badge,
}: {
  heading: string;
  subheading?: string;
  badge?: JSX.Element;
}) => {
  return (
    <div className='px-4 py-2 flex flex-col items-center space-y-1'>
      {badge}
      <h1 className='py-2 font-playfair_Display font-semibold text-3xl sm:text-4xl text-center cursor-default'>
        {heading}
      </h1>
    </div>
  );
};

export default PageHeading;
