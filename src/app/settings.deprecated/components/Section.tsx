import React, { FC } from 'react';

import { twMerge } from 'tailwind-merge';

type SectionProps = {
  sectionTitle: string;
  children: React.ReactNode;
};
const Section: FC<SectionProps> = ({ sectionTitle, children }) => {
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      <h3
        className={twMerge(
          sectionTitle === 'Danger' && 'text-alert-red',
          'w-full sm:w-3/12 font-dm_sans text-lg'
        )}
      >
        {sectionTitle}
      </h3>

      <div className='flex-1'>{children}</div>
    </div>
  );
};

export default Section;
