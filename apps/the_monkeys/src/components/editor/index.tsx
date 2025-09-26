'use client';

import React, { FC, useCallback, useEffect, useRef } from 'react';

import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs';

export type EditorProps = {
  data: OutputData;
  onChange: (data: OutputData) => void;
  config: EditorConfig;
};

const Editor: FC<EditorProps> = ({ data, onChange, config }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  const handleChange = useCallback(
    async (api: any) => {
      if (onChange) {
        const savedData = await api.saver.save();
        onChange(savedData);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...config,
        data: data,
        onChange: handleChange,
      });
    }

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [config, data, handleChange]);

  return (
    <div className='w-full px-4 space-y-6' id='editorjs_editor-container'></div>
  );
};

export default Editor;
