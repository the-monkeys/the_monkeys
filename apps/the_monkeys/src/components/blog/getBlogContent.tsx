'use client';

import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { SmartImage } from '@/components/common/SmartImage';
import { Blog } from '@/services/blog/blogTypes';
import { decodeBlurHashToDataURL } from '@/utils/blurhash';
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

  const resolveUrl = useCallback(async () => {
    // Check if image is a Storage V2 API URL (ends in /url)
    if (image && image.includes('/storage/posts/') && image.endsWith('/url')) {
      try {
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
  }, [image]);

  useEffect(() => {
    resolveUrl();
  }, [resolveUrl]);

  return (
    <SmartImage
      src={imgSrc}
      alt={title}
      blurHash={blurHash}
      width={800}
      height={500}
      containerClassName={className}
      quality={100}
      priority={false}
    />
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
    <SmartImage
      src={placeholderImage.src}
      alt={title}
      height={500}
      width={800}
      containerClassName={className}
      quality={100}
    />
  );
};
