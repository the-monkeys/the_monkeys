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

import { EditorProps } from '@/components/editor';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { EditorConfig, OutputData } from '@editorjs/editorjs';
import { useSession } from 'next-auth/react';

// Dynamically import the Editor component to avoid server-side rendering issues
const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

// Initial data structure for the editor with a title block by default
const initial_data = {
  time: new Date().getTime(),
  blocks: [
    {
      id: 'title',
      type: 'header',
      data: {
        text: 'Give your blog a title',
        level: 1,
        config: {
          placeholder: 'pen your thoughts ...',
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
  const { data: session } = useSession();

  const authToken = session?.user.token;
  const router = useRouter();

  // Use useRef to store the blog ID
  const blogIdRef = useRef<string>(Math.random().toString(36).substring(7));
  const blogId = blogIdRef.current;

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
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
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

  // Load the Editor component dynamically
  useEffect(() => {
    const loadEditor = async () => {
      const module = await import('@/components/editor');
      setEditor(() => module.default);
    };

    loadEditor();
  }, []);

  // Create WebSocket connection when authToken is available
  useEffect(() => {
    if (typeof window !== 'undefined' && authToken) {
      const cleanup = createWebSocket(blogId, authToken);

      // Listen for beforeunload event to close the WebSocket connection
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

  // Handle the publish action
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
        console.log(res);
        toast({
          variant: 'success',
          title: 'Blog Published successfully',
          description: 'success',
        });
        setPublishedBlogLoading(false);
        router.push(`/${session?.user?.username}`);
      })
      .catch((err) => {
        console.log(err);
        setPublishedBlogLoading(false);
        toast({
          variant: 'destructive',
          title: 'Error publishing blog',
          description: 'error',
        });
      });
  }, [data, session?.user.account_id, blogId, formatData, router]);

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
  }, [data, webSocket, session?.user.account_id, formatData]);

  return (
    <>
      <div className='space-y-2'>
        <div className='mx-auto w-full sm:w-4/5 flex justify-between items-end'>
          {isSaving ? (
            <p className='font-josefin_Sans text-sm sm:text-base opacity-75'>
              Saving ...
            </p>
          ) : (
            <p className='font-josefin_Sans text-sm sm:text-base opacity-75'>
              Saved
            </p>
          )}

          <Button
            variant='secondary'
            onClick={() => setShowModal(true)}
            className='hidden sm:inline-flex'
          >
            Publish
          </Button>

          <Button
            variant='secondary'
            size='icon'
            onClick={() => setShowModal(true)}
            className='show sm:hidden rounded-full'
          >
            <Icon name='RiArrowRight' />
          </Button>
        </div>

        <Suspense fallback={<Loader />}>
          {editor && data && editorConfig && (
            <Editor data={data} onChange={setData} config={editorConfig} />
          )}
        </Suspense>
      </div>

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
