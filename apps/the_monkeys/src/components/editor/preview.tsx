import React, { FC, useEffect, useRef } from 'react';

import { editorConfig } from '@/config/editor/monkeys_editor_readonly.config';
import MonkeysEditor, { OutputData } from '@themonkeys/monkeys-editor';

export type EditorProps = {
  data?: OutputData;
};

const Editor: FC<EditorProps> = ({ data }) => {
  const editorInstance = useRef<MonkeysEditor | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new MonkeysEditor({
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
      id='monkeys_editor_editor-container'
    ></div>
  );
};

export default Editor;
