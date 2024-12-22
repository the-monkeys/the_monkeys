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
      data-underline={isDraft ? 'false' : 'true'}
      dangerouslySetInnerHTML={{ __html: purifyHTMLString(titleContent) }}
      className='mb-1 font-roboto font-medium text-xl lg:text-2xl capitalize line-clamp-2 data-[underline=true]:group-hover:underline underline-offset-2 decoration-1'
    ></h2>
  );

  const recommendationTitleDiv = (
    <h2
      dangerouslySetInnerHTML={{ __html: purifyHTMLString(titleContent) }}
      className='font-roboto font-medium text-lg lg:text-xl capitalize line-clamp-2 group-hover:underline underline-offset-2 decoration-1'
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
          className='font-roboto text-sm sm:text-base opacity-80 line-clamp-1 sm:line-clamp-2'
        ></p>
      );
    }

    if (!imageDiv && block.type === 'image') {
      imageContent = block?.data?.file?.url || '';
      imageDiv = (
        <img
          src={imageContent}
          alt='Blog Image'
          loading='lazy'
          className='h-full w-full object-cover group-hover:opacity-90'
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
        className='font-roboto text-sm sm:text-base opacity-80 line-clamp-1 sm:line-clamp-2'
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
