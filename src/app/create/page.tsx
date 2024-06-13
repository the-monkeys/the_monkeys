'use client';

import React, { Suspense, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { EditorProps } from '@/components/editor';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import { OutputData } from '@editorjs/editorjs';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

const initial_data = {
  time: new Date().getTime(),
  blocks: [],
};

type BlockChange = {
  id: string;
  type: string;
  time: number;
};

export type BlockChanges = Map<string, BlockChange>;

function App() {
  const [editor, setEditor] = useState<React.FC<EditorProps> | null>(null);
  const [data, setData] = useState<OutputData>(initial_data);
  const [blockChanges, setBlockChanges] = useState<BlockChanges>(new Map());
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
      <div className='px-5 sm:px-4 flex gap-2 items-end justify-end'>
        <Button size='lg' onClick={() => setShowModal(true)}>
          Publish
        </Button>
      </div>

      <p className='my-2 px-5 sm:px-4 font-jost text-sm'>Saved in Drafts</p>

      <Suspense fallback={<p>Loading...</p>}>
        {editor && (
          <Editor
            data={data}
            onChange={setData}
            setBlockChanges={setBlockChanges}
          />
        )}
      </Suspense>

      {showModal && <PublishModal setModal={setShowModal} />}
    </>
  );
}

export default App;
