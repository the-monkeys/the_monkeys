const PageHeading = ({
  heading,
  subheading,
  badge,
}: {
  heading: string;
  subheading?: string;
  badge?: JSX.Element;
}) => {
  return (
    <div className='px-4 py-2 flex flex-col items-center gap-2'>
      {badge}

      <h1 className='py-2 font-playfair_Display font-semibold text-3xl sm:text-4xl text-center cursor-default'>
        {heading}
      </h1>

      {subheading && <h4 className='font-jost text-lg'>{subheading}</h4>}
    </div>
  );
};

export default PageHeading;
