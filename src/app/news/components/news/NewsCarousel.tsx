import { JSX, SVGProps } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { NewsSource2 } from '@/services/news/newsTypes';

interface NewsCarouselProps {
  newsArray: NewsSource2[];
}
export default function NewsCarousel({ newsArray }: NewsCarouselProps) {
  return (
    <Carousel
      className='w-full max-w-4xl my-2'
      opts={{
        loop: true,
        active: true,
      }}
    >
      <CarouselContent>
        {newsArray.map((news, index) => (
          <CarouselItem key={index}>
            <div className='grid gap-4 md:grid-cols-2 items-center'>
              <img
                src={news.urlToImage}
                alt={news.title}
                width='600'
                height='400'
                className='rounded-lg object-cover aspect-video'
              />
              <div className='space-y-2'>
                <h3 className='text-2xl font-semibold'>{news.title}</h3>
                <p className='text-muted-foreground'>
                  {news.description.slice(0, 50)}...
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 hover:bg-background/75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'>
        <ChevronLeftIcon className='w-5 h-5 text-foreground' />
      </CarouselPrevious>
      <CarouselNext className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 hover:bg-background/75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'>
        <ChevronRightIcon className='w-5 h-5 text-foreground' />
      </CarouselNext>
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
        <div />
        <div />
        <div />
      </div>
    </Carousel>
  );
}

function ChevronLeftIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m15 18-6-6 6-6' />
    </svg>
  );
}

function ChevronRightIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m9 18 6-6-6-6' />
    </svg>
  );
}
