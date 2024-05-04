import { FC } from 'react';

import { OutputBlockData, OutputData } from '@editorjs/editorjs';

import { editorBlockVariantStyles } from '../variantStyles';

export type BlogViewStyles = {
  base: string;
  header1: string;
  header2: string;
  header3: string;
  paragraph: string;
  list: string;
  listItemOrdered: string;
  listItemUnordered: string;
  delimiter: string;
};

type BlogViewProps = {
  data: OutputData;
};

const generateBlogViewBlocks = (block: OutputBlockData) => {
  const { id, type, data } = block;

  const baseStyle = editorBlockVariantStyles.base;

  const renderHeaderBlock = () => {
    let headerLevelStyles;

    const level = data.level || 1;

    if (level === 1) {
      headerLevelStyles = editorBlockVariantStyles.header1;

      return (
        <h1 key={id} className={`${baseStyle} ${headerLevelStyles}`}>
          {data.text}
        </h1>
      );
    } else if (level === 2) {
      headerLevelStyles = editorBlockVariantStyles.header2;

      return (
        <h2 key={id} className={`${baseStyle} ${headerLevelStyles}`}>
          {data.text}
        </h2>
      );
    } else {
      headerLevelStyles = editorBlockVariantStyles.header3;

      return (
        <h3 key={id} className={`${baseStyle} ${headerLevelStyles}`}>
          {data.text}
        </h3>
      );
    }
  };

  const renderParagraphBlock = () => {
    return (
      <p
        key={id}
        className={`${baseStyle} ${editorBlockVariantStyles.paragraph}`}
      >
        {data.text}
      </p>
    );
  };

  const renderListBlock = () => {
    if (data.style === 'ordered') {
      return (
        <ol
          key={id}
          className={`${baseStyle} ${editorBlockVariantStyles.list}`}
        >
          {data.items.map((item: string, index: number) => {
            return (
              <li
                key={`${id}_${index}`}
                className={`${editorBlockVariantStyles.listItemOrdered}`}
              >
                {item}
              </li>
            );
          })}
        </ol>
      );
    } else {
      return (
        <ul
          key={id}
          className={`${baseStyle} ${editorBlockVariantStyles.list}`}
        >
          {data.items.map((item: string, index: number) => {
            return (
              <li
                key={`${id}_${index}`}
                className={`${editorBlockVariantStyles.listItemUnordered}`}
              >
                {item}
              </li>
            );
          })}
        </ul>
      );
    }
  };

  const renderDelimiterBlock = () => {
    return (
      <div
        key={id}
        className={`${baseStyle} ${editorBlockVariantStyles.delimiter}`}
      >
        * * *
      </div>
    );
  };

  switch (type) {
    case 'header':
      return renderHeaderBlock();
    case 'paragraph':
      return renderParagraphBlock();
    case 'list':
      return renderListBlock();
    case 'delimiter':
      return renderDelimiterBlock();
    default:
  }
};

const BlogView: FC<BlogViewProps> = ({ data }) => {
  return (
    <div className='px-5 sm:px-4 py-2 break-words'>
      {data?.blocks.map((block) => {
        return generateBlogViewBlocks(block);
      })}
    </div>
  );
};

export default BlogView;
