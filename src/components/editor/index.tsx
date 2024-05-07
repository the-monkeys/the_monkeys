import React, { FC, useEffect, useRef } from 'react';

import { BlockChanges } from '@/app/create/page';
import EditorJS, { OutputData } from '@editorjs/editorjs';

import { editorConfig } from '../../config/editorjs.config';

export type EditorProps = {
  data: OutputData;
  onChange: (data: OutputData) => void;
  setBlockChanges: React.Dispatch<React.SetStateAction<BlockChanges>>;
};

const Editor: FC<EditorProps> = ({ data, onChange, setBlockChanges }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...editorConfig,
        data: data,
        onChange: async (api, event: any) => {
          if (onChange) {
            const savedData = await api.saver.save();

            const id = event?.detail?.target?.id;
            const type = event?.detail?.target?.name;
            const time = savedData.time;

            if (id && type && time) {
              setBlockChanges((prevChanges) => {
                const newBlockChanges = new Map(prevChanges);
                newBlockChanges.set(id, { id, type, time });
                return newBlockChanges;
              });
            }

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
