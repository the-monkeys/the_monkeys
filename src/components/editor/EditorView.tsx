import { FC, useEffect, useRef } from 'react';

import EditorJS, { OutputData } from '@editorjs/editorjs';

import { editorViewConfig } from '../../config/editorjs.config';

export type EditorViewProps = {
  data?: OutputData;
};

const EditorView: FC<EditorViewProps> = ({ data }) => {
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...editorViewConfig,
        readOnly: true,
        data: data,
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
      className='px-5 sm:px-4 py-2 font-jost'
      id='editorjs_veiw-container'
    ></div>
  );
};

export default EditorView;
