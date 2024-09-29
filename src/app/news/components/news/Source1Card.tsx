import { NewsSource1 } from '@/services/news/newsTypes';
import { twMerge } from 'tailwind-merge';

export const Source1TitleCard = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h2 className={twMerge(className, 'font-josefin_Sans font-semibold')}>
      {title}
    </h2>
  );
};

export const Source1NewsCard1 = ({
  newsItem,
  className,
}: {
  newsItem: NewsSource1;
  className?: string;
}) => {
  return (
    <div className={twMerge(className)}>
      <img
        src={newsItem.image || ''}
        alt={newsItem.source || ''}
        loading='lazy'
        className='h-[200px] w-full object-cover'
      />

      <p className='mt-1 mb-2 font-jost text-xs sm:text-sm'>
        {newsItem.source}
      </p>

      <h2 className='font-josefin_Sans font-semibold'>{newsItem.title}</h2>
    </div>
  );
};

export const Source1NewsCard2 = ({
  newsItem,
  className,
}: {
  newsItem: NewsSource1;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        className,
        (className = 'py-6 flex flex-col sm:flex-row gap-4')
      )}
    >
      <img
        src={newsItem.image || ''}
        alt={newsItem.source || ''}
        loading='lazy'
        className='w-full h-[250px] sm:w-1/2 object-cover'
      />

      <div className='flex-1'>
        <p className='mt-1 mb-2 font-jost text-xs sm:text-sm'>
          {newsItem.source}
        </p>

        <h2 className='font-josefin_Sans font-semibold line-clamp-2'>
          {newsItem.title}
        </h2>

        <p className='mt-2 font-jost font-light line-clamp-2'>
          {newsItem.description}
        </p>
      </div>
    </div>
  );
};
