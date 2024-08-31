'use client';

import React, { Suspense, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { EditorProps } from '@/components/editor';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { OutputData } from '@editorjs/editorjs';
import { useSession } from 'next-auth/react';

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
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const { data: session } = useSession();
  const authToken = session?.user.token;
  // Generate random blog ID
  const blogId = Math.random().toString(36).substring(7);
  // Function to create and manage WebSocket connection
  const createWebSocket = (blogId: string, token: string) => {
    const ws = new WebSocket(
      `wss://dev.themonkeys.site/api/v1/blog/draft/${blogId}?token=${token}`
    );

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed, attempting to reconnect...');
      setTimeout(() => {
        createWebSocket(blogId, token);
      }, 1000); // Reconnect after 1 second
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWebSocket(ws);
  };

  // Function to format data
  const formatData = (data: OutputData, accountId: string | undefined) => {
    return {
      owner_account_id: accountId,
      blog: {
        time: data.time,
        blocks: data.blocks.map((block) => ({
          ...block,
          author: [accountId],
          time: new Date().getTime(),
        })),
      },
      tags: ['first', 'last', 'middle'],
    };
  };

  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  useEffect(() => {
    if (authToken) {
      createWebSocket(blogId, authToken);
    }
  }, [authToken]);

  const handlePublishStep = () => {
    const formattedData = formatData(data, session?.user.account_id);

    axiosInstance
      .post(`/blog/publish/${blogId}`)
      .then((res) => {
        console.log(res);
        toast({
          variant: 'success',
          title: 'Blog Published successfully',
          description: 'success',
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: 'destructive',
          title: 'Error publishing blog',
          description: 'error',
        });
      });
  };

  useEffect(() => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const formattedData = formatData(data, session?.user.account_id);
      webSocket.send(JSON.stringify(formattedData));
    }
  }, [data, webSocket, session?.user.account_id]);

  return (
    <div className='space-y-2'>
      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={() => console.log(data)}>
          Preview
        </Button>

        <Button onClick={() => handlePublishStep()}>Publish</Button>
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        {editor && <Editor data={data} onChange={setData} />}
      </Suspense>

      {showModal && <PublishModal setModal={setShowModal} />}
    </div>
  );
};

export default CreatePage;
