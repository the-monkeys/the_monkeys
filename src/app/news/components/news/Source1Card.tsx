import { Badge } from '@/components/ui/badge';
import { NewsSource1 } from '@/services/news/newsTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
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
    <div className={twMerge(className, 'group')}>
      <img
        src={newsItem?.image || ''}
        alt={newsItem?.source || ''}
        loading='lazy'
        className='h-[200px] w-full object-cover group-hover:opacity-75'
      />

      <p className='mt-2 mb-1 font-jost text-xs sm:text-sm opacity-75'>
        {newsItem?.source}
      </p>

      <h2 className='font-josefin_Sans font-semibold line-clamp-2'>
        {newsItem?.title}
      </h2>
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
        (className = 'group py-6 flex flex-col sm:flex-row gap-4')
      )}
    >
      <img
        src={newsItem?.image || ''}
        alt={newsItem?.source || ''}
        loading='lazy'
        className='sm:w-60 h-[200px] object-cover group-hover:opacity-75'
      />

      <div className='flex-1'>
        <p className='mb-2 font-jost text-xs sm:text-sm opacity-75'>
          {newsItem?.source}
        </p>

        <h2 className='font-josefin_Sans font-semibold text-lg line-clamp-2'>
          {newsItem?.title}
        </h2>

        <p
          dangerouslySetInnerHTML={{
            __html: purifyHTMLString(newsItem.description),
          }}
          className='mt-1 font-jost font-light line-clamp-3'
        ></p>
      </div>
    </div>
  );
};

export const Source1NewsCard3 = ({ newsItem }: { newsItem: NewsSource1 }) => {
  return (
    <>
      <Badge variant='secondary' className='mb-4 capitalize'>
        {newsItem?.category}
      </Badge>

      <h2 className='font-josefin_Sans font-semibold text-lg sm:text-xl line-clamp-2'>
        {newsItem?.title}
      </h2>

      <p
        dangerouslySetInnerHTML={{
          __html: purifyHTMLString(newsItem?.description),
        }}
        className='mt-1 font-jost font-light line-clamp-2 text-sm sm:text-base'
      ></p>
    </>
  );
};
