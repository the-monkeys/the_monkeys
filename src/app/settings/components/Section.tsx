import React, { FC } from 'react';

type SectionProps = {
  sectionTitle: string;
  children: React.ReactNode;
};
const Section: FC<SectionProps> = ({ sectionTitle, children }) => {
  return (
    <div className='flex flex-col sm:flex-row gap-6'>
      <h3 className='w-full sm:w-3/12 font-josefin_Sans text-xl border-b-1 sm:border-b-0 sm:border-r-1 border-secondary-lightGrey/15'>
        {sectionTitle}
      </h3>
      <div className='flex-1'>{children}</div>
    </div>
  );
};

export default Section;
