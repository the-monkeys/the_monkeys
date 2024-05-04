'use client';

import React, { Suspense, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import BlogView from '@/components/blog/BlogView';
import Button from '@/components/button';
// import Editor, { EditorProps } from '@/components/editor';
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
  const [editorState, setEditorState] = useState<EditorState>('Edit');

  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  const handleEditorState = () => {
    if (editorState === 'Edit') {
      setEditorState('Preview');
    } else {
      setEditorState('Edit');
    }
  };

  return (
    <div>
      <div className='px-5 sm:px-4 flex gap-2 items-center justify-end'>
        <Button
          title={editorState === 'Edit' ? 'Preview' : 'Modify'}
          variant='secondary'
          onClick={handleEditorState}
          className='transition-all'
        />

        <Button
          title='Publish'
          variant='primary'
          onClick={() => setShowModal(true)}
        />
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        {editor && editorState === 'Edit' && (
          <Editor data={data} onChange={setData} />
        )}
      </Suspense>

      {editorState === 'Preview' && <BlogView data={data} />}

      {showModal && <PublishModal setModal={setShowModal} />}
    </div>
  );
}

export default App;
