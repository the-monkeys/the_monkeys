'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useGetTopHeadlines } from '@/hooks/useGetAllNews';
import { NewsSource3 } from '@/services/news/newsTypes';

const TopNewsHeadingMobileView = () => {
  const { topHeadlines, isLoading, error } = useGetTopHeadlines();

  const newsData = topHeadlines as NewsSource3;

  if (newsData) {
    return (
      <>
        <div className='block md:hidden'>
          {newsData && (
            <Carousel
              className='w-full max-w-xl my-2'
              opts={{
                loop: true,
                active: true,
              }}
            >
              {' '}
              <h3 className='w-fit font-josefin_Sans text-xl text-secondary-lightGrey'>
                Top Headlines
              </h3>
              <CarouselContent>
                {newsData.slice(0, 10).map((news, index) => (
                  <CarouselItem key={index}>
                    <div className='p-4'>
                      <h3 className='text-light text-sm text-primary-monkeyBlack font-semibold text-center dark:text-white'>
                        {news}
                      </h3>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='opacity-25 absolute left-[-4px] top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 hover:bg-background/75'></CarouselPrevious>
              <CarouselNext className='opacity-25 absolute right-[-4px] top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 hover:bg-background/75'></CarouselNext>
            </Carousel>
          )}
        </div>
      </>
    );
  }
};

export default TopNewsHeadingMobileView;
