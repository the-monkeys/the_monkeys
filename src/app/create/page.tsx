'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

const Page = () => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const { data: session } = useSession();
  const authToken = session?.user.token;

  const [editor, setEditor] = useState<React.FC<any> | null>(null);
  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);
  //generate random blog id
  const blogId = Math.random().toString(36).substring(7);
  useEffect(() => {
    if (authToken) {
      createWebSocket(blogId, authToken);
    }
  }, [authToken]);

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
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    setWebSocket(ws);
  };

  return (
    <div className='space-y-2'>
      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={() => console.log('data')}>
          Preview
        </Button>
      </div>
    </div>
  );
};

export default Page;
