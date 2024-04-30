import { FC } from 'react';

import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { twMerge } from 'tailwind-merge';

type HeaderLevelStyles = {
  [key: number]: string;
};

type EditorPreviewProps = {
  data: OutputData;
};

const generatePreviewBlocks = (block: OutputBlockData) => {
  const { id, type, data } = block;

  const renderHeaderBlock = () => {
    const headerLevelStyles: HeaderLevelStyles = {
      1: 'font-jost text-[2rem]',
      2: 'font-jost text-[1.8rem]',
      3: 'font-jost text-[1.5rem]',
    };
    const level = data.level || 1;
    const styleClass = headerLevelStyles[level] || headerLevelStyles[1];
    const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
      <HeaderTag key={id} className={`${styleClass} pt-2`}>
        {data.text}
      </HeaderTag>
    );
  };

  const renderListBlock = () => (
    <ul key={id} className='list-outside py-1 pl-10'>
      {data.items.map((item: string) => {
        return (
          <li
            className={twMerge(
              data.style === 'ordered' ? 'list-decimal' : 'list-disc',
              'py-2 font-jost'
            )}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );

  const renderParagraphBlock = () => {
    return (
      <p key={id} className='font-jost py-2 text-[1.2rem]'>
        {data.text}
      </p>
    );
  };

  switch (type) {
    case 'header':
      return renderHeaderBlock();
    case 'list':
      return renderListBlock();
    default:
      return renderParagraphBlock();
  }
};

const EditorPreview: FC<EditorPreviewProps> = ({ data }) => {
  return (
    <div className='px-5 sm:px-4 py-2 cursor-default'>
      {data?.blocks.map((block) => {
        return generatePreviewBlocks(block);
      })}
    </div>
  );
};

export default EditorPreview;
