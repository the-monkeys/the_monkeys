import Link from 'next/link';

import { CarouselItem } from '@/components/ui/carousel';
import { NewsSource1 } from '@/services/news/newsTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

export const CarouselCard = ({ newsItem }: { newsItem: NewsSource1 }) => {
  return (
    <CarouselItem className='max-h-fit p-0'>
      <p className='mb-2 font-dm_sans font-medium text-xs sm:text-sm capitalize opacity-80'>
        {newsItem.category}
      </p>

      <Link href={newsItem.url || '#'} target='_blank' className='group'>
        <h2
          dangerouslySetInnerHTML={{
            __html: purifyHTMLString(newsItem?.title),
          }}
          className='font-medium text-lg sm:text-xl line-clamp-2 group-hover:underline underline-offset-2 decoration-1'
        ></h2>

        <p
          dangerouslySetInnerHTML={{
            __html: purifyHTMLString(newsItem?.description),
          }}
          className='text-sm sm:text-base opacity-80 line-clamp-2 sm:line-clamp-1'
        ></p>
      </Link>
    </CarouselItem>
  );
};
