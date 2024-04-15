'use client';

import React, { Suspense, useEffect, useState } from 'react';

import { EditorProps } from '@/components/editor';
import { OutputData } from '@editorjs/editorjs';

const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'header',
      data: {
        text: 'Heading 1',
        level: 1,
      },
    },
    {
      type: 'header',
      data: {
        text: 'Heading 2',
        level: 2,
      },
    },
    {
      type: 'header',
      data: {
        text: 'Heading 3',
        level: 3,
      },
    },
    {
      type: 'paragraph',
      data: {
        text: 'This is a paragraph',
      },
    },
  ],
};

function App() {
  const [data, setData] = useState<OutputData>(INITIAL_DATA);
  const [Editor, setEditor] = useState<React.FC<EditorProps> | null>(null);

  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  return (
    <Suspense fallback={<div className='h-screen'>Loading...</div>}>
      {Editor && <Editor data={data} onChange={setData} />}
    </Suspense>
  );
}

export default App;
