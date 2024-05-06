'use client';

import React, { Suspense, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import Button from '@/components/button';
import PublishModal from '@/components/modals/publish/PublishModal';
import { OutputData } from '@editorjs/editorjs';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

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

export type EditorState = 'Edit' | 'Preview';

type EditorProps = {
  data: OutputData;
  onChange?: (data: OutputData) => void;
};

function App() {
  const [editor, setEditor] = useState<React.FC<EditorProps> | null>(null);
  const [data, setData] = useState<OutputData>(initial_data);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  return (
    <>
      <div className='px-5 sm:px-2 flex gap-2 items-end justify-end'>
        <Button
          title='Publish'
          variant='primary'
          onClick={() => setShowModal(true)}
        />
      </div>

      <p className='my-2 px-5 sm:px-2 font-jost text-sm'>Saved in Drafts</p>

      <Suspense fallback={<p>Loading...</p>}>
        {editor && <Editor data={data} onChange={setData} />}
      </Suspense>

      {showModal && <PublishModal setModal={setShowModal} />}
    </>
  );
}

export default App;
