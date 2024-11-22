'use client';

import { Loader } from '@/components/loader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useGetTopHeadlines } from '@/hooks/blog/useGetAllNews';
import { NewsSource3 } from '@/services/news/newsTypes';
import { RiDoubleQuotesL } from '@remixicon/react';

export const TopHeadlinesMobile = () => {
  const { topHeadlines, isLoading, error } = useGetTopHeadlines();

  const newsData = topHeadlines as NewsSource3;

  if (isLoading)
    return (
      <div className='block lg:hidden mt-2 space-y-2'>
        <Loader className='mx-auto' />

        <p className='font-jost text-sm text-center'>
          Fetching latest headlines
        </p>
      </div>
    );

  if (error)
    return (
      <p className='block lg:hidden py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching headlines. Try again.
      </p>
    );

  return (
    <Carousel
      orientation='horizontal'
      opts={{
        align: 'start',
        loop: true,
        active: true,
      }}
      className='block lg:hidden mt-4'
    >
      <h3 className='font-josefin_Sans font-semibold text-center'>
        Top Headlines
      </h3>

      <Separator className='w-1/2 my-2 mx-auto bg-secondary-lightGrey/25' />

      <CarouselContent className='h-fit m-0 text-center gap-2'>
        {newsData.slice(0, 15).map((newsItem, index) => (
          <CarouselItem
            key={index}
            className='relative p-2 sm:basis-1/2 text-center'
          >
            <RiDoubleQuotesL className='size-6 absolute top-0 left-0 text-secondary-darkGrey/15 dark:text-secondary-white/15' />

            <p className='font-jost cursor-default line-clamp-2'>{newsItem}</p>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className='flex justify-center gap-4'>
        <CarouselPrevious variant={'ghost'} />
        <CarouselNext variant={'ghost'} />
      </div>
    </Carousel>
  );
};
