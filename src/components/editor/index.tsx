import React, { FC, useEffect, useRef } from 'react';

import EditorJS, { OutputData } from '@editorjs/editorjs';

import { editorConfig } from '../../config/editorjs.config';

export type EditorProps = {
  data: OutputData;
  onChange: (data: OutputData) => void;
};

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
      className='mx-auto w-full sm:w-4/5 px-5 sm:px-4 font-jost space-y-6'
      id='editorjs_editor-container'
    ></div>
  );
};

export default Editor;
