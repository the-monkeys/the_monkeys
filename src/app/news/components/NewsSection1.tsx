'use client';

import { NewsSection1Skeleton } from '@/components/skeletons/newsSkeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useGetAllNews1 } from '@/hooks/useGetAllNews';
import { NewsSource1 } from '@/services/news/newsTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

import {
  Source1NewsCard1,
  Source1NewsCard2,
  Source1NewsCard3,
  Source1TitleCard,
} from './news/Source1Card';

export default function NewsSection1() {
  const { news, isLoading, error } = useGetAllNews1();

  const newsData = news?.data as NewsSource1[];

  if (isLoading) return <NewsSection1Skeleton />;

  if (error)
    return (
      <p className='py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching news. Try again.
      </p>
    );

  // filtering out the duplicates and news with different languages
  const newsTitles = new Set();

  const updatedNewsData = newsData.filter((item) => {
    if (newsTitles.has(item.title) || item.language !== 'en') {
      return false;
    }

    newsTitles.add(item.title);
    return true;
  });

  const newsDataWithImagesAndUniqueDesc = updatedNewsData.filter((item) => {
    if (item.image == null) return null;

    if (
      item.image !== null &&
      (item.image.endsWith('jpg') || item.image.endsWith('img'))
    )
      if (item.title.slice(0, 25) !== item.description.slice(0, 25)) {
        return item;
      }
  });

  const newsDataWithoutImages = updatedNewsData.filter((item) => {
    if (item.image !== null) return null;

    if (item.title.slice(0, 25) !== item.description.slice(0, 25)) {
      return item;
    }
  });

  return (
    <>
      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-3 sm:col-span-2'>
          <img
            src={newsDataWithImagesAndUniqueDesc[0].image || ''}
            alt={newsDataWithImagesAndUniqueDesc[0].author || ''}
            loading='lazy'
            className='w-full'
          />

          <p className='mt-1 mb-2 font-jost text-xs sm:text-sm opacity-75'>
            {newsDataWithImagesAndUniqueDesc[0].source}
          </p>

          <h2 className='font-josefin_Sans font-semibold text-lg md:text-2xl line-clamp-2 md:line-clamp-none'>
            {newsDataWithImagesAndUniqueDesc[0].title}
          </h2>

          <p
            dangerouslySetInnerHTML={{
              __html: purifyHTMLString(
                newsDataWithImagesAndUniqueDesc[0].description
              ),
            }}
            className='font-jost font-light line-clamp-2 sm:line-clamp-4'
          ></p>
        </div>

        <div className='col-span-3 sm:col-span-1'>
          <div>
            <img
              src={newsDataWithImagesAndUniqueDesc[1].image || ''}
              alt={newsDataWithImagesAndUniqueDesc[1].author || ''}
              loading='lazy'
              className='group-hover:opacity-75'
            />

            <h2 className='mt-1 font-josefin_Sans font-semibold text-lg sm:text-xl line-clamp-2 md:line-clamp-none'>
              {newsDataWithImagesAndUniqueDesc[1].title}
            </h2>
          </div>

          <p className='mt-2 mb-1 px-1 font-jost'>Related News</p>

          <div className='border-1 border-secondary-lightGrey/25 divide-y-1 divide-secondary-lightGrey/25'>
            <Source1TitleCard
              title={newsDataWithoutImages[0].title}
              className='py-3 px-2 hover:bg-secondary-lightGrey/15'
            />

            <Source1TitleCard
              title={newsDataWithoutImages[1].title}
              className='py-3 px-2 hover:bg-secondary-lightGrey/15'
            />

            <Source1TitleCard
              title={newsDataWithoutImages[2].title}
              className='py-3 px-2 hover:bg-secondary-lightGrey/15'
            />
          </div>
        </div>
      </div>

      <Separator className='hidden sm:block my-4' />

      <div className='mt-6 sm:mt-0 grid grid-cols-2 gap-6'>
        <Source1NewsCard1
          newsItem={newsDataWithImagesAndUniqueDesc[2]}
          className='col-span-2 sm:col-span-1'
        />

        <Source1NewsCard1
          newsItem={newsDataWithImagesAndUniqueDesc[3]}
          className='col-span-2 sm:col-span-1'
        />

        <Source1NewsCard1
          newsItem={newsDataWithImagesAndUniqueDesc[4]}
          className='col-span-2 sm:col-span-1'
        />

        <Source1NewsCard1
          newsItem={newsDataWithImagesAndUniqueDesc[5]}
          className='col-span-2 sm:col-span-1'
        />
      </div>

      <Carousel
        orientation='horizontal'
        opts={{
          align: 'start',
          loop: true,
          active: true,
        }}
        className='mt-6 space-y-4'
      >
        <CarouselContent className='h-fit m-0 text-center gap-2'>
          {newsDataWithoutImages
            .slice(3, newsDataWithoutImages.length)
            .map((newsItem) => (
              <CarouselItem
                key={`${newsItem.published_at}_${newsItem.author}`}
                className='max-h-fit  p-0'
              >
                <Source1NewsCard3 newsItem={newsItem} />
              </CarouselItem>
            ))}
        </CarouselContent>
        <div className='flex justify-center gap-4'>
          <CarouselPrevious variant={'ghost'} />
          <CarouselNext variant={'ghost'} />
        </div>
      </Carousel>

      <Separator className='my-4' />

      {newsDataWithImagesAndUniqueDesc.slice(6, 10).map((newsItem) => (
        <Source1NewsCard2
          key={`${newsItem.published_at}_${newsItem.author}`}
          newsItem={newsItem}
        />
      ))}
    </>
  );
}
