'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

import { EditorProps } from '@/components/editor';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import useGetDraftBlogDetail from '@/hooks/useGetDraftBlogDetail';
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('blogId');

  // Use useRef to store the blog ID
  const blogIdRef = useRef<string>(
    blogId || Math.random().toString(36).substring(7)
  );
  const currentBlogId = blogIdRef.current;

  // Fetch draft blog details if blogId is present
  const { blogs: draftBlog, isLoading: isDraftLoading } = useGetDraftBlogDetail(
    session?.user.account_id,
    blogId
  );

  // Function to create and manage WebSocket connection
  const createWebSocket = useCallback((blogId: string, token: string) => {
    const ws = new WebSocket(
      `wss://dev.themonkeys.site/api/v1/blog/draft/${blogId}?token=${token}`
    );

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      setIsSaving(false); // Reset saving status when message is received
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
  }, []);

  // Function to format data
  const formatData = useCallback(
    (data: OutputData, accountId: string | undefined) => {
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
        tags: ['tech', 'nextjs', 'ui'],
      };
    },
    []
  );

  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  useEffect(() => {
    if (session?.user.token && !isDraftLoading) {
      createWebSocket(currentBlogId, session.user.token);
    }
  }, [session?.user.token, currentBlogId, createWebSocket, isDraftLoading]);

  useEffect(() => {
    if (blogId && draftBlog) {
      setData(draftBlog.blog);
      console.log(draftBlog.blog, 'draftBlog.blog');
    }
  }, [blogId, draftBlog]);

  const handlePublishStep = useCallback(() => {
    const formattedData = formatData(data, session?.user.account_id);

    axiosInstance
      .post(`/blog/publish/${currentBlogId}`, formattedData)
      .then((res) => {
        console.log(res);
        toast({
          variant: 'success',
          title: 'Blog Published successfully',
          description: 'success',
        });
        router.push(`/`);
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: 'destructive',
          title: 'Error publishing blog',
          description: 'error',
        });
      });
  }, [data, session?.user.account_id, currentBlogId, formatData, router]);

  useEffect(() => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const formattedData = formatData(data, session?.user.account_id);
      webSocket.send(JSON.stringify(formattedData));
      setIsSaving(true); // Set saving status when data is sent
    }
  }, [data, webSocket, session?.user.account_id, formatData]);

  return (
    <div className='space-y-2'>
      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={() => console.log(data)}>
          Preview
        </Button>

        <Button onClick={handlePublishStep}>Publish</Button>
      </div>
      <div className='flex items-center gap-2'>
        Saving draft {isSaving ? <Loader /> : <Icon name='RiCheck' size={20} />}{' '}
      </div>
      <Suspense fallback={<Loader />}>
        {editor && !isDraftLoading && <Editor data={data} onChange={setData} />}
      </Suspense>
      {showModal && <PublishModal setModal={setShowModal} />}
    </div>
  );
};

export default CreatePage;
