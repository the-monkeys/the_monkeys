import React, { FC, useEffect, useRef, useState } from 'react';

import EditorJS, {
  BlockId,
  BlockToolData,
  OutputData,
  Tool,
} from '@editorjs/editorjs';
import { BlockTuneData } from '@editorjs/editorjs/types/block-tunes/block-tune-data';

import { editorConfig } from '../../config/editorjs.config';

export type EditorProps = {
  data: OutputData;
  onChange?: (data: OutputData) => void;
};

interface ModifiedOutputData {
  version?: string;
  time?: number;
  blocks: {
    id?: string;
    type: string;
    data: BlockToolData;
    time?: number;
    tunes?: { [name: string]: BlockTuneData };
  }[];
}

const Editor: FC<EditorProps> = ({ data, onChange }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...editorConfig,
        data: data,
        onChange: async (api, event: any) => {
          if (onChange) {
            const savedData = await api.saver.save();

            onChange(savedData);
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

  return (
    <div
      className='px-5 sm:px-4 font-jost'
      id='editorjs_editor-container'
    ></div>
  );
};

export default Editor;
