'use client';

import { CarouselCard } from '@/components/news/cards/CarouselCard';
import { NewsSection1Skeleton } from '@/components/skeletons/newsSkeleton';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useGetAllNews1 } from '@/hooks/blog/useGetAllNews';
import { NewsSource1 } from '@/services/news/newsTypes';

export const NewsSection1 = () => {
  const { news, isLoading, error } = useGetAllNews1();

  const newsData = news?.data as NewsSource1[];

  if (isLoading) return <NewsSection1Skeleton />;

  if (error) return null;

  const newsTitles = new Set();

  const updatedNewsData = newsData.filter((item) => {
    if (newsTitles.has(item.title) || item.language !== 'en') {
      return false;
    }

    newsTitles.add(item.title);
    return true;
  });

  const newsDataWithoutImages = updatedNewsData.filter((item) => {
    if (item.image !== null) return null;

    if (item.title.slice(0, 25) !== item.description.slice(0, 25)) {
      return item;
    }
  });

  return (
    <div className='py-4 sm:py-6'>
      <Carousel
        orientation='horizontal'
        opts={{
          align: 'start',
          loop: true,
          active: true,
        }}
        className='space-y-4'
      >
        <CarouselContent className='h-fit m-0 text-center gap-2'>
          {newsDataWithoutImages
            .slice(0, newsDataWithoutImages.length)
            .map((newsItem) => (
              <CarouselCard
                key={`${newsItem.published_at}_${newsItem.author}`}
                newsItem={newsItem}
              />
            ))}
        </CarouselContent>

        <div className='mx-auto w-fit pt-2 flex justify-center gap-4'>
          <CarouselPrevious variant={'outline'} />
          <CarouselNext variant={'outline'} />
        </div>
      </Carousel>
    </div>
  );
};
