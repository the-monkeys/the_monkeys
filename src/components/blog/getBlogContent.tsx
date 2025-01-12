import Image from 'next/image';

import { Blog } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

export const getCardContent = ({
  blog,
  isDraft = false,
}: {
  blog: Blog;
  isDraft?: boolean;
}) => {
  const blocks = blog?.blog?.blocks || [];
  const titleContent = blocks[0]?.data?.text;
  let descriptionContent = '';
  let imageContent = null;

  const titleDiv = (
    <h2
      data-hover={isDraft ? 'false' : 'true'}
      dangerouslySetInnerHTML={{ __html: purifyHTMLString(titleContent) }}
      className='font-bold text-xl lg:text-[22px] capitalize line-clamp-2 data-[hover=true]:group-hover:opacity-80'
    ></h2>
  );

  const recommendationTitleDiv = (
    <h2
      dangerouslySetInnerHTML={{ __html: purifyHTMLString(titleContent) }}
      className='font-semibold capitalize line-clamp-2 group-hover:opacity-80'
    ></h2>
  );

  let descriptionDiv = null;
  let imageDiv = null;

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    if (
      !descriptionDiv &&
      (block.type === 'list' ||
        block.type === 'paragraph' ||
        block.type === 'header')
    ) {
      descriptionContent =
        block?.data?.text || block?.data?.items?.join(', ') || '';
      descriptionDiv = (
        <p
          dangerouslySetInnerHTML={{
            __html: purifyHTMLString(descriptionContent),
          }}
          className='opacity-80 leading-[1.4] line-clamp-2'
        ></p>
      );
    }

    if (!imageDiv && block.type === 'image') {
      imageContent = block?.data?.file?.url || '';
      imageDiv = (
        <Image
          src={imageContent}
          alt={titleContent}
          height={500}
          width={500}
          quality={80}
          loading='lazy'
          className='h-full w-full object-cover'
        />
      );
    }

    if (descriptionDiv && imageDiv) break;
  }

  if (!descriptionDiv) {
    descriptionContent = titleContent;
    descriptionDiv = (
      <p
        dangerouslySetInnerHTML={{
          __html: purifyHTMLString(descriptionContent),
        }}
        className='opacity-80 line-clamp-2'
      ></p>
    );
  }

  return {
    titleDiv,
    recommendationTitleDiv,
    descriptionDiv,

    imageDiv,
  };
};
