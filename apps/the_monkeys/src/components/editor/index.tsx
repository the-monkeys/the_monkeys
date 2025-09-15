'use client';

import React, { FC, useEffect, useRef } from 'react';

import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs';

export type EditorProps = {
  data: OutputData;
  onChange: (data: OutputData) => void;
  config: EditorConfig;
};

const Editor: FC<EditorProps> = ({ data, onChange, config }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...config,
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
    <div className='w-full px-4 space-y-6' id='editorjs_editor-container'></div>
  );
};

export default Editor;
