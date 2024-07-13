import { newsData } from '@/constants/news';

import NewsCard from './NewsCard';

const NewsSection = () => {
  return (
    <div className='flex flex-wrap divide-y-1 md:divide-y-0 divide-secondary-lightGrey/25'>
      {newsData.map((newsItem, index) => {
        return <NewsCard key={index} {...newsItem} />;
      })}
    </div>
  );
};

export default NewsSection;
