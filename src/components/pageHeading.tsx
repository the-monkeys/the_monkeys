const PageHeading = ({ heading }: { heading: string }) => {
  return (
    <h1 className='py-5 font-playfair_Display font-semibold text-4xl text-center'>
      {heading}
    </h1>
  );
};

export default PageHeading;
