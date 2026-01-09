import React, { FC, useEffect, useRef } from 'react';

import { editorConfig } from '@/config/editor/editorjs_readonly.config';
import { Block } from '@/services/blog/blogTypes';
import EditorJS from '@editorjs/editorjs';

export type EditorProps = {
  data?: { time: number; blocks: Block[] };
};

const Editor: FC<EditorProps> = ({ data }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...editorConfig,
        data: data,
      });
    }

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='mx-auto px-4 -mt-[30px] break-words'
      id='editorjs_editor-container'
    ></div>
  );
};

export default Editor;
