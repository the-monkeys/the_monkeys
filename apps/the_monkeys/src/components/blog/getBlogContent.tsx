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
    titleContent,
    descriptionContent,
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
      className={twMerge(className, 'capitalize')}
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
  // need to optimize this further
  return (
    <img
      src={image}
      alt={title}
      className={twMerge(className, 'h-full w-full object-cover object-center')}
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
  // need to optimize this further
  return (
    <img
      src={placeholderImage.src}
      alt={title}
      className={twMerge(
        className,
        'h-full w-full object-cover object-top md:object-center'
      )}
    />
  );
};
