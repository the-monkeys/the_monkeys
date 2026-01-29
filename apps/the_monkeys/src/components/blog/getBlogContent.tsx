'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { Blog } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { twMerge } from 'tailwind-merge';

import placeholderImage from '../../../public/image-placeholder.png';

export const getCardContent = ({ blog }: { blog: Blog }) => {
  const blocks = blog?.blog?.blocks || [];
  const titleContent = blocks[0]?.data?.text;

  let descriptionContent = null;
  let imageContent = null;

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    if (
      !descriptionContent &&
      (block.type === 'list' ||
        block.type === 'quote' ||
        block.type === 'paragraph' ||
        block.type === 'header')
    ) {
      descriptionContent =
        block?.data?.text || block?.data?.items?.join(', ') || '';
    }

    if (!imageContent && block.type === 'image') {
      imageContent = block?.data?.file?.url || null;
    }

    if (descriptionContent && imageContent) break;
  }

  if (!descriptionContent) {
    descriptionContent = titleContent;
  }

  return {
    titleContent: purifyHTMLString(titleContent),
    descriptionContent: purifyHTMLString(descriptionContent),
    imageContent,
  };
};

export const BlogTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h2
      className={twMerge(className, 'w-fit capitalize tracking-tight')}
      dangerouslySetInnerHTML={{
        __html: purifyHTMLString(title),
      }}
    />
  );
};

export const BlogHeading = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h1
      className={twMerge(className, 'w-fit capitalize tracking-tight')}
      dangerouslySetInnerHTML={{
        __html: purifyHTMLString(title),
      }}
    />
  );
};

export const BlogDescription = ({
  description,
  className,
}: {
  description: string;
  className?: string;
}) => {
  return (
    <p
      className={twMerge(className, 'leading-[1.4]')}
      dangerouslySetInnerHTML={{
        __html: purifyHTMLString(description),
      }}
    />
  );
};

import { decodeBlurHashToDataURL } from '@/utils/blurhash';

export const BlogImage = ({
  title,
  image,
  className,
}: {
  title: string;
  image: string;
  className?: string;
}) => {
  const [imgSrc, setImgSrc] = useState<string>(image);
  const [blurHash, setBlurHash] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveUrl = async () => {
      // Check if image is a Storage V2 API URL (ends in /url)
      if (image && image.includes('/storage/posts/') && image.endsWith('/url')) {
        try {
          // Fetch meta instead of just url to get blurhash
          const metaUrl = image.replace('/url', '/meta');
          const res = await fetch(metaUrl);
          const data = await res.json();
          if (data) {
            if (data.url) setImgSrc(data.url);
            if (data.blurhash) setBlurHash(data.blurhash);
          }
        } catch (error) {
          console.error('Failed to resolve V2 Image Metadata:', error);
        }
      } else {
        setImgSrc(image);
      }
    };

    resolveUrl();
  }, [image]);

  const blurDataURL = decodeBlurHashToDataURL(blurHash);

  return (
    <div
      className={twMerge(
        className,
        'relative overflow-hidden bg-gray-200 dark:bg-gray-800'
      )}
    >
      <Image
        src={imgSrc}
        alt={title}
        height='500'
        width='800'
        className={twMerge(
          'h-full w-full object-cover object-center transition-opacity duration-500',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        quality={100}
        priority={false}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} // Prevent indefinite loading state
      />
      {isLoading && !blurDataURL && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-orange'></div>
        </div>
      )}
    </div>
  );
};

export const BlogPlaceholderImage = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <Image
      src={placeholderImage.src}
      alt={title}
      height='500'
      width='800'
      className={twMerge(className, 'h-full w-full object-cover object-center')}
      quality={100}
    />
  );
};
