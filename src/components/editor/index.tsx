import React, { FC, useEffect, useRef } from 'react';

import EditorJS, { OutputData } from '@editorjs/editorjs';

import editorConfig from './editorjs.config';

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
            const data = await api.saver.save();
            onChange(data);
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

  return <div className='font-josefin_Sans' id='editorjs-container'></div>;
};

export default Editor;
