'use client';

import React, { FC, useEffect, useRef } from 'react';

import { EditorConfig, OutputData } from '@editorjs/editorjs';

export type EditorProps = {
  data: OutputData;
  onChange: (data: OutputData) => void;
  config: EditorConfig;
};

const Editor: FC<EditorProps> = ({ data, onChange, config }) => {
  const editorInstance = useRef<any | null>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    // Dynamically import EditorJS and plugins only on client-side mount
    const initEditor = async () => {
      if (editorInstance.current || isInitializing.current) return;

      isInitializing.current = true;

      try {
        const EditorJS = (await import('@editorjs/editorjs')).default;
        // Check again to be safe
        if (!editorInstance.current) {
          editorInstance.current = new EditorJS({
            ...config,
            data: data,
            onChange: async (api: any, event: any) => {
              if (onChange) {
                const savedData = await api.saver.save();
                onChange(savedData);
              }
            },
          });
        }
      } catch (error) {
        console.error('Editor initialization failed', error);
      } finally {
        isInitializing.current = false;
      }
    };

    initEditor();

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='w-full px-4 space-y-6' id='editorjs_editor-container'></div>
  );
};

export default Editor;
