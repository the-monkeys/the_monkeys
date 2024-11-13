const Section = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className='space-y-4'>
      <h4 className='font-josefin_Sans font-medium text-xl sm:text-2xl'>
        {title}
      </h4>

      <div className='space-y-2 font-jost opacity-75'>{children}</div>
    </div>
  );
};

export default Section;
