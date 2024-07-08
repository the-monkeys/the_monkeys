const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className='space-y-4'>
      <h4 className='font-josefin_Sans text-xl sm:text-2xl'>{title}</h4>

      <div className='space-y-4 font-jost text-secondary-darkGrey/75 dark:text-secondary-white/75'>
        {children}
      </div>
    </div>
  );
};

export default PolicySection;
