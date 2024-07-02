const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className='space-y-6'>
      <h4 className='py-2 font-josefin_Sans text-2xl'>{title}</h4>

      <div className='space-y-2 font-jost text-secondary-darkGrey/75 dark:text-secondary-white/75'>
        {children}
      </div>
    </div>
  );
};

export default PolicySection;
