import React, { FC } from 'react';

import { twMerge } from 'tailwind-merge';

type SectionProps = {
  sectionTitle: string;
  isDanger?: boolean;
  children: React.ReactNode;
};

export const Section: FC<SectionProps> = ({
  sectionTitle,
  isDanger,
  children,
}) => {
  return (
    <div>
      <h3
        className={twMerge(
          isDanger && 'text-alert-red',
          'p-1 w-full border-b-1 border-secondary-lightGrey/25 font-dm_sans text-lg md:text-xl'
        )}
      >
        {sectionTitle}
      </h3>

      <div className='mt-4'>{children}</div>
    </div>
  );
};
