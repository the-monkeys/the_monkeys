'use client';

import React, { Suspense, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { EditorProps } from '@/components/editor';
import Icon from '@/components/icon';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
          Save Draft
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icon
              name='RiMore'
              className='hover:opacity-75 cursor-pointer rotate-90'
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className='m-2'>
            <DropdownMenuItem>
              <div
                className='flex w-full items-center gap-2'
                onClick={() => setShowModal(true)}
              >
                <Icon name='RiArticle' />

                <p className='font-josefin_Sans text-base'>Publish</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <div className='flex w-full items-center gap-2'>
                <Icon name='RiEye' />

                <p className='font-josefin_Sans text-base'>Preview</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        {editor && <Editor data={data} onChange={setData} />}
      </Suspense>

      {showModal && <PublishModal setModal={setShowModal} />}
    </div>
  );
};

export default CreatePage;
