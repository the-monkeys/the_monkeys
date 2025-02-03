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

import { useSession } from '@/app/session-store-provider';
import { EditorProps } from '@/components/editor';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { WSS_URL_V2 } from '@/constants/api';
import axiosInstance from '@/services/api/axiosInstance';
import { EditorConfig, OutputData } from '@editorjs/editorjs';

// Dynamically import the Editor component to avoid server-side rendering issues
const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

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
  // State to manage the editor component
  const [editor, setEditor] = useState<React.FC<EditorProps> | null>(null);

  // State to manage the editor data
  const [data, setData] = useState<OutputData>(initial_data);

  // State to manage the visibility of the publish modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // State to manage the WebSocket connection
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  // State to manage the saving status
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // State to manage the editor configuration
  const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);

  // set selected tags topics
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [publishedBlogLoading, setPublishedBlogLoading] =
    useState<boolean>(false);
  // Get the session data
  const { data: session, status } = useSession();

  const authToken = session?.user?.token;
  const router = useRouter();

  // Use useRef to store the blog ID
  const blogIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const blogId = blogIdRef.current;

  // Function to create and manage WebSocket connection
  const createWebSocket = useCallback((blogId: string, token: string) => {
    const ws = new WebSocket(
      `${WSS_URL_V2}/blog/draft/${blogId}?token=${token}`
    );

    ws.onopen = () => {
      console.log('websocket connection 🟢');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received');
      setIsSaving(false); // Reset saving status when message is received
    };

    ws.onclose = () => {
      console.log('websocket connection 🔴');
    };

    ws.onerror = (error) => {
      console.error('websocket error ⭕', error);
    };

    setWebSocket(ws);

    // Cleanup function to close the WebSocket connection
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
        tags: selectedTags,
      };
    },
    [selectedTags]
  );

  const handlePublishStep = useCallback(() => {
    setPublishedBlogLoading(true);
    if (!data || data.blocks.length === 0 || data.blocks[0].type !== 'header') {
      setPublishedBlogLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Blog must have a title.',
      });

      return; // Ensure data is not null and has a title block
    }

    const formattedData = formatData(data, session?.user.account_id);

    axiosInstance
      .post(`/blog/publish/${blogId}`, formattedData)
      .then((res) => {
        toast({
          variant: 'success',
          title: 'Blog Published successfully',
          description: 'success',
        });

        setPublishedBlogLoading(false);
        router.push(`/${session?.user?.username}`);
      })
      .catch((err) => {
        setPublishedBlogLoading(false);

        toast({
          variant: 'destructive',
          title: 'Error publishing blog',
          description: 'error',
        });
      });
  }, [data, session?.user.account_id, blogId, formatData, router]);

  // Load the Editor component dynamically
  useEffect(() => {
    const loadEditor = async () => {
      const editor = await import('@/components/editor');
      setEditor(() => editor.default);
    };

    loadEditor();
  }, []);

  // Create WebSocket connection when authToken is available
  useEffect(() => {
    if (typeof window !== 'undefined' && authToken) {
      const cleanup = createWebSocket(blogId, authToken);

      const handleBeforeUnload = () => {
        cleanup();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        cleanup();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [authToken, blogId, createWebSocket]);

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
      const formattedData = formatData(data, session?.user.account_id);
      webSocket.send(JSON.stringify(formattedData));
      setIsSaving(true); // Set saving status when data is sent
    }

    if (
      webSocket &&
      webSocket.readyState === WebSocket.CLOSED &&
      data &&
      authToken
    ) {
      setTimeout(() => {
        const cleanup = createWebSocket(blogId, authToken);

        return () => {
          cleanup();
        };
      }, 1200);
    }
  }, [data, webSocket, session?.user.account_id, formatData]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const url = new URL('/auth/login', location.href);
      url.searchParams.set('callbackURL', location.href);

      router.replace(url.pathname + url.search);
    }
  }, []);

  return (
    <>
      <div className='space-y-4'>
        <div className='py-1 mx-auto w-full sm:w-4/5 flex justify-end items-center'>
          <Button
            size='icon'
            onClick={() => setShowModal(true)}
            title='Publish Blog'
            className='rounded-full'
          >
            <Icon name='RiArrowRight' />
          </Button>
        </div>

        <div className='mt-4 min-h-screen'>
          <Suspense fallback={<Loader />}>
            {editor && data && editorConfig && (
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

      {showModal && (
        <PublishModal
          setModal={setShowModal}
          setSelectedTags={setSelectedTags}
          blogId={blogId}
          handlePublishStep={handlePublishStep}
          publishedBlogLoading={publishedBlogLoading}
        />
      )}
    </>
  );
};

export default CreatePage;
