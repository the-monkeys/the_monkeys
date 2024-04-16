'use client';

import React, { Suspense, useEffect, useState } from 'react';

import { EditorProps } from '@/components/editor';
import { OutputData } from '@editorjs/editorjs';

const initial_data = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'paragraph',
      data: {},
    },
  ],
};

function App() {
  const [Editor, setEditor] = useState<React.FC<EditorProps> | null>(null);
  const [data, setData] = useState<OutputData>(initial_data);

  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  return (
    <div>
      <div></div>

      <Suspense fallback={<p>Loading...</p>}>
        {Editor && <Editor data={data} onChange={setData} />}
      </Suspense>
    </div>
  );
}

export default App;
