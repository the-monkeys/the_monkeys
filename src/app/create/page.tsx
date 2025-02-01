'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { PublishBlogDialog } from '@/components/blog/actions/PublishBlogDialog';
import { EditorProps } from '@/components/editor';
import { Loader } from '@/components/loader';
import { ChooseTopicDialog } from '@/components/topics/dialogs/ChooseTopicDialog';
import { toast } from '@/components/ui/use-toast';
import { WSS_URL_V2 } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import axiosInstance from '@/services/api/axiosInstance';
import { EditorConfig, OutputData } from '@editorjs/editorjs';

// Dynamically import the Editor component to avoid server-side rendering issues
const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const initial_data = {
  time: new Date().getTime(),
  blocks: [
    {
      id: 'title',
      type: 'header',
      data: {
        text: 'Untitled Blog',
        level: 1,
        config: {
          placeholder: 'pen your thoughts...',
        },
      },
    },
  ],
};

const CreatePage = () => {
  const { data: session, isError } = useAuth();
  const router = useRouter();

  // editor states
  const [editor, setEditor] = useState<React.FC<EditorProps> | null>(null);
  const [data, setData] = useState<OutputData>(initial_data);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);
  const [blogPublishLoading, setBlogPublishLoading] = useState<boolean>(false);
  const [blogTopics, setBlogTopics] = useState<string[]>([]);

  const accountId = session?.account_id;
  const username = session?.username;

  // Use useRef to store the blog ID
  const blogIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const blogId = blogIdRef.current;

  // Function to create and manage WebSocket connection
  const createWebSocket = useCallback((blogId: string) => {
    const ws = new WebSocket(`${WSS_URL_V2}/blog/draft/${blogId}`);

    ws.onopen = () => {
      console.log('websocket connection 🟢');
    };

    ws.onmessage = (event) => {
      setIsSaving(false); // Reset saving status when message is received
    };

    ws.onclose = () => {
      console.log('websocket connection 🔴');
    };

    ws.onerror = (error) => {
      console.error('websocket error ⭕', error);
    };

    setWebSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Function to format data before sending it to the server
  const formatData = useCallback(
    (data: OutputData, accountId: string | undefined) => {
      return {
        owner_account_id: accountId,
        author_list: [accountId],
        content_type: 'editorjs',
        blog: {
          time: data.time,
          blocks: data.blocks.map((block) => ({
            ...block,
            author: [accountId],
            time: new Date().getTime(),
          })),
        },
        tags: blogTopics,
      };
    },
    [blogTopics]
  );

  const handlePublishStep = useCallback(() => {
    setBlogPublishLoading(true);
    if (!data || data.blocks.length === 0 || data.blocks[0].type !== 'header') {
      setBlogPublishLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Blog must have a title.',
      });

      return; // Ensure data is not null and has a title block
    }

    const formattedData = formatData(data, accountId);

    axiosInstance
      .post(`/blog/publish/${blogId}`, formattedData)
      .then((res) => {
        toast({
          variant: 'success',
          title: 'Blog Published successfully',
          description: 'success',
        });

        setBlogPublishLoading(false);
        router.push(`/${username}`);
      })
      .catch((err) => {
        setBlogPublishLoading(false);

        toast({
          variant: 'destructive',
          title: 'Error publishing blog',
          description: 'error',
        });
      });
  }, [data, accountId, blogId, formatData, router]);

  // Load the Editor component dynamically

  useEffect(() => {
    if (isError) {
      const url = new URL('/auth/login', location.href);
      url.searchParams.set('callbackURL', location.href);

      router.replace(url.pathname + url.search);
    }
  }, [isError]);

  // Create WebSocket connection when authToken is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanup = createWebSocket(blogId);

      const handleBeforeUnload = () => {
        cleanup();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        cleanup();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [blogId, createWebSocket]);

  // Create editor configuration when blogId is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getEditorConfig = async (blogId: string) => {
        const { getEditorConfig } = await import(
          '@/config/editor/editorjs.config'
        );
        setEditorConfig(getEditorConfig(blogId));
      };

      getEditorConfig(blogId);
    }
  }, [blogId]);

  // Send data to WebSocket when data changes
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      webSocket &&
      webSocket.readyState === WebSocket.OPEN
    ) {
      const formattedData = formatData(data, accountId);
      webSocket.send(JSON.stringify(formattedData));
      setIsSaving(true); // Set saving status when data is sent
    }

    if (webSocket && webSocket.readyState === WebSocket.CLOSED && data) {
      setTimeout(() => {
        const cleanup = createWebSocket(blogId);

        return () => {
          cleanup();
        };
      }, 1000);
    }
  }, [data, blogTopics, webSocket, accountId, formatData]);

  return (
    <>
      <div className='space-y-4'>
        <div className='p-2 flex justify-center items-center gap-[6px]'>
          <ChooseTopicDialog
            blogTopics={blogTopics}
            setBlogTopics={setBlogTopics}
          />

          <PublishBlogDialog
            isPublishing={blogPublishLoading}
            handlePublish={handlePublishStep}
          />
        </div>

        <div className='py-3 min-h-screen'>
          <Suspense fallback={<Loader />}>
            {data && editorConfig && (
              <Editor data={data} onChange={setData} config={editorConfig} />
            )}
          </Suspense>
        </div>
      </div>

      {webSocket && isSaving && (
        <div className='sticky w-fit left-[50%] -translate-x-[50%] bottom-[53px] md:bottom-4 p-2 z-[99]'>
          <div className='px-[10px] py-1 bg-foreground-light dark:bg-foreground-dark rounded-md'>
            <p className='text-sm text-center'>Saving blog...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePage;
