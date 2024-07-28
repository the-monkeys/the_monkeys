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

const CreatePage = () => {
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
    <div className='space-y-2'>
      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={() => console.log(data)}>
          Preview
        </Button>

        <Button onClick={() => setShowModal(true)}>Publish</Button>
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        {editor && <Editor data={data} onChange={setData} />}
      </Suspense>

      {showModal && <PublishModal setModal={setShowModal} />}
    </div>
  );
};

export default CreatePage;
