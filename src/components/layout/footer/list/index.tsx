import { FC } from 'react';

import LinksRedirectUnderline from '@/components/links/LinksRedirectUnderline';

export type FooterList = {
  listHeading: string;
  listItems: {
    title: string;
    link: string;
  }[];
};

type ListProps = {
  listData: FooterList;
};

const List: FC<ListProps> = ({ listData }) => {
  return (
    <div className='flex w-full flex-col gap-2 sm:w-fit'>
      <p className='font-josefin_Sans text-lg'>{listData.listHeading}</p>
      <div className='flex flex-col items-start gap-2'>
        {listData?.listItems.map((item, index) => {
          return (
            <LinksRedirectUnderline
              target={item.link}
              title={item.title}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default List;
