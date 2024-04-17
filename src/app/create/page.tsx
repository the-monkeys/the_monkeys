'use client';

import React, { Suspense, useEffect, useState } from 'react';

import Button from '@/components/button';
import { EditorProps } from '@/components/editor';
import IconContainer from '@/components/icon';
import { OutputData } from '@editorjs/editorjs';

const initial_data = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'header',
      data: {
        level: 1,
      },
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
      <div className='px-5 sm:px-4 py-2 flex gap-4 items-end justify-between'>
        <p className='font-josefin_Sans text-sm sm:text-base'>Draft saved</p>
        <div className='flex gap-4 items-center justify-between'>
          <Button title='Publish Blog' variant='primary' />
          <IconContainer name='RiMoreFill' />
        </div>
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        {Editor && <Editor data={data} onChange={setData} />}
      </Suspense>
    </div>
  );
}

export default App;
