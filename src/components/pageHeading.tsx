const PageHeading = ({
  children,
  heading,
}: {
  heading: string;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <h1 className='py-5 font-playfair_Display font-semibold text-3xl sm:text-4xl text-center'>
        {heading}
      </h1>

      {children}
    </>
  );
};

export default PageHeading;
