'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { PublishBlogDialog } from '@/components/blog/actions/PublishBlogDialog';
import { PublishBlogDrawer } from '@/components/blog/actions/PublishBlogDrawer';
import { Loader } from '@/components/loader';
import { EditorBlockSkeleton } from '@/components/skeletons/blogSkeleton';
import { WSS_URL_V2 } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import axiosInstance from '@/services/api/axiosInstance';
import { EditorConfig, OutputData } from '@editorjs/editorjs';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { twMerge } from 'tailwind-merge';

import { generateSlug } from '../blog/utils/generateSlug';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
  loading: () => (
    <div className='w-full'>
      <EditorBlockSkeleton />
    </div>
  ),
});

const initial_data = {
  time: Date.now(),
  blocks: [
    {
      id: 'title',
      type: 'header',
      data: {
        text: 'Untitled Post',
        level: 1,
      },
    },
  ],
};

const useWebSocket = (blogId: string, token: string | undefined) => {
  const webSocketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!token) return;

    // Close existing connection if any
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    setConnectionStatus('Connecting...');
    const ws = new WebSocket(
      `${WSS_URL_V2}/blog/draft/${blogId}?token=${token}`
    );

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      reconnectAttemptsRef.current = 0;
      console.log('WebSocket connected 🟢');
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log('WebSocket closed 🔴', event.code, event.reason);

      // Exponential backoff reconnection
      const delay = Math.min(
        1000 * Math.pow(2, reconnectAttemptsRef.current),
        30000
      );
      reconnectAttemptsRef.current += 1;

      if (reconnectAttemptsRef.current <= 5) {
        setConnectionStatus(`Reconnecting in ${Math.round(delay / 1000)}s...`);
        setTimeout(connect, delay);
      } else {
        setConnectionStatus('Disconnected - Please refresh');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error ⭕', error);
      ws.close();
    };

    webSocketRef.current = ws;
  }, [blogId, token]);

  useEffect(() => {
    connect();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, [connect]);

  const sendData = useCallback((data: unknown) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  return { isConnected, connectionStatus, sendData };
};

const CreatePage = () => {
  const { data: session, isError } = useAuth();
  const router = useRouter();

  // State management
  const [data, setData] = useState<OutputData>(initial_data);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);
  const [blogPublishLoading, setBlogPublishLoading] = useState(false);
  const [blogTopics, setBlogTopics] = useState<string[]>([]);
  const [token, setToken] = useState<string>();

  const accountId = session?.account_id;
  const username = session?.username;
  const blogIdRef = useRef(`${Math.random().toString(36).substring(7)}`);
  const blogId = blogIdRef.current;

  // WebSocket management
  const { isConnected, connectionStatus, sendData } = useWebSocket(
    blogId,
    token
  );

  // Get WebSocket token
  useEffect(() => {
    if (!session) return;

    const fetchToken = async () => {
      try {
        const response = await axiosInstance.get('/auth/ws-token');
        setToken(response.data.token);
      } catch (error) {
        console.error('Failed to get WebSocket token:', error);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description:
            'Failed to establish connection. Please refresh the page.',
        });
      }
    };

    fetchToken();

    // Refresh token every 5 minutes
    const tokenRefreshInterval = setInterval(fetchToken, 5 * 60 * 1000);
    return () => clearInterval(tokenRefreshInterval);
  }, [session]);

  // Handle authentication errors
  useEffect(() => {
    if (isError) {
      const url = new URL('/auth/login', window.location.href);
      url.searchParams.set('callbackURL', window.location.href);
      router.replace(url.pathname + url.search);
    }
  }, [isError, router]);

  // Load editor config
  useEffect(() => {
    const loadEditorConfig = async () => {
      try {
        const { getEditorConfig } = await import(
          '@/config/editor/editorjs.config'
        );
        setEditorConfig(getEditorConfig(blogId));
      } catch (error) {
        console.error('Failed to load editor config:', error);
      }
    };

    loadEditorConfig();
  }, [blogId]);

  // Format data for transmission
  const formatData = useCallback(
    (data: OutputData) => {
      const title =
        data.blocks.find((block) => block.id === 'title')?.data.text ||
        'No Title';

      const slug = generateSlug(title);
      const blogSlug = `${slug}-${blogId}`;
      return {
        owner_account_id: accountId,
        author_list: [accountId],
        content_type: 'editorjs',
        blog: {
          time: data.time || Date.now(),
          blocks:
            data.blocks?.map((block) => ({
              ...block,
              author: [accountId],
              time: Date.now(),
            })) || [],
        },
        tags: blogTopics,
        slug: blogSlug,
      };
    },
    [accountId, blogTopics]
  );

  // Auto-save when data changes
  useEffect(() => {
    if (!data || !isConnected) return;

    // Debounce saving to avoid too frequent saves
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    const timer = setTimeout(() => {
      const formattedData = formatData(data);
      const success = sendData(formattedData);
      if (success) {
        setIsSaving(true);
        // Automatically clear saving status after 3 seconds if no response
        setTimeout(() => setIsSaving(false), 3000);
      }
    }, 2000);

    setSaveTimer(timer);

    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [data, isConnected, formatData, sendData]);

  // Handle blog publishing
  const handlePublishStep = useCallback(async () => {
    if (!data || data.blocks.length <= 2) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Post must contain at least 3 content blocks.',
      });
      return;
    }

    if (data.blocks[0].type !== 'title' && data?.blocks[0].data.level !== 1) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Post should start with title (Heading 1).',
      });
      return;
    }

    const titleBlockCount = data.blocks.filter(
      (block) => block.type === 'title'
    ).length;
    if (titleBlockCount > 1) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Only one title block (Heading 1) is allowed in the post.',
      });
      return;
    }

    setBlogPublishLoading(true);
    try {
      await axiosInstance.post(`/blog/publish/${blogId}`, formatData(data));
      toast({
        variant: 'success',
        title: 'Blog Published Successfully',
        description: 'Your post is now live!',
      });
      router.push(`/${username}`);
    } catch (error) {
      console.error('Publish error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Publishing Blog',
        description: 'There was an error while publishing. Please try again.',
      });
    } finally {
      setBlogPublishLoading(false);
    }
  }, [data, blogId, formatData, router, username]);

  return (
    <div className='relative min-h-screen'>
      <div className='pt-4 pb-3 flex justify-between items-center gap-2'>
        <div
          className={twMerge(
            'px-[10px] py-[1px] flex items-center gap-1 border-1 rounded-full',
            isConnected
              ? 'border-alert-green/80 bg-alert-green/20'
              : 'border-alert-red/80 bg-alert-red/20'
          )}
        >
          <div
            className={`inline-block size-2 rounded-full ${
              isConnected ? 'bg-alert-green' : 'bg-alert-red'
            }`}
          />

          <p className='text-xs'>{isConnected ? 'Online' : 'Offline'}</p>
        </div>

        <div className='flex items-center gap-2'>
          <PublishBlogDrawer
            topics={blogTopics}
            setTopics={setBlogTopics}
            data={data}
            isPublishing={blogPublishLoading}
            handlePublish={handlePublishStep}
          />

          {/* <PublishBlogDialog
            topics={blogTopics}
            setTopics={setBlogTopics}
            data={data}
            isPublishing={blogPublishLoading}
            handlePublish={handlePublishStep}
          /> */}
        </div>
      </div>

      <div className='py-3'>
        <Suspense
          fallback={
            <div className='p-6 flex itemx-center'>
              <Loader size={40} className='text-brand-orange' />
            </div>
          }
        >
          {data && editorConfig && (
            <Editor data={data} onChange={setData} config={editorConfig} />
          )}
        </Suspense>
      </div>

      {isSaving && (
        <div className='fixed left-1/2 -translate-x-1/2 bottom-[30px] p-2 z-50'>
          <div className='px-3 py-1 border-1 border-yellow-500/80 bg-yellow-500/50 rounded-full shadow-sm flex items-center gap-1'>
            <div className={`inline-block size-2 rounded-full bg-yellow-500`} />

            <p className='text-xs sm:text-sm'>Saving...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePage;
