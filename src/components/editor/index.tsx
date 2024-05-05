import React, { FC, useEffect, useRef } from 'react';

import EditorJS, { BlockToolData, OutputData } from '@editorjs/editorjs';

import editorConfig from '../../config/editorjs.config';

export type EditorProps = {
  data: OutputData;
  onChange?: (data: OutputData) => void;
};

const Editor: FC<EditorProps> = ({ data, onChange }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...editorConfig,
        data: data,
        onChange: async (api, event) => {
          if (onChange) {
            const modifiedData = addTimestampToBlock(await api.saver.save());
            onChange(modifiedData);
          }
        },
      });
    }
    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  const addTimestampToBlock = (data: OutputData): OutputData => {
    return {
      ...data,
      blocks: data.blocks.map((block: BlockToolData) => ({
        ...block,
        data: {
          ...block.data,
          timestamp: new Date().getTime(),
        },
        author: [],
      })),
    };
  };

  return (
    <div className='px-5 sm:px-4 py-2 font-jost' id='editorjs-container'></div>
  );
};

export default Editor;
