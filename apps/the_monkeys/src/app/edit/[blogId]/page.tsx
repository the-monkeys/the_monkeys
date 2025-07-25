'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { PublishBlogDialog } from '@/components/blog/actions/PublishBlogDialog';
import { Loader } from '@/components/loader';
import { EditorBlockSkeleton } from '@/components/skeletons/blogSkeleton';
import { ChooseTopicDialog } from '@/components/topics/actions/ChooseTopicDialog';
import { getEditorConfig } from '@/config/editor/editorjs.config';
import { WSS_URL_V2 } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import useGetDraftBlogDetail from '@/hooks/blog/useGetDraftBlogDetail';
import axiosInstance from '@/services/api/axiosInstance';
import { OutputData } from '@editorjs/editorjs';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { mutate } from 'swr';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

const EditPage = ({ params }: { params: { blogId: string } }) => {
  const blogId = params.blogId;
  const { data: session } = useAuth();
  const router = useRouter();
  const { blog, isLoading } = useGetDraftBlogDetail(blogId);

  // Refs for latest values
  const dataRef = useRef<OutputData | null>(null);
  const accountIdRef = useRef<string | undefined>();
  const blogTopicsRef = useRef<string[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State variables
  const [data, setData] = useState<OutputData | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [blogPublishLoading, setBlogPublishLoading] = useState(false);
  const [blogTopics, setBlogTopics] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  const accountId = session?.account_id;
  const username = session?.username;

  // Keep refs updated
  useEffect(() => {
    dataRef.current = data;
    accountIdRef.current = accountId;
    blogTopicsRef.current = blogTopics;
  }, [data, accountId, blogTopics]);

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

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [session]);

  // Format data for transmission
  const formatData = useCallback(
    (data: OutputData, accountId: string | undefined, blogTopics: string[]) => {
      return {
        owner_account_id: accountId,
        author_list: [accountId],
        content_type: 'editorjs',
        blog: {
          time: data?.time || Date.now(),
          blocks:
            data?.blocks?.map((block) => ({
              ...block,
              author: [accountId],
              time: Date.now(),
            })) || [],
        },
        tags: blogTopics,
      };
    },
    []
  );

  // WebSocket management
  useEffect(() => {
    if (!token || !blogId) return;

    let isMounted = true;
    const MAX_RETRIES = 5;
    let retryCount = 0;

    const connectWebSocket = () => {
      if (!isMounted) return;

      if (webSocketRef.current) {
        webSocketRef.current.close();
      }

      setConnectionStatus('Connecting...');

      try {
        const ws = new WebSocket(
          `${WSS_URL_V2}/blog/draft/${blogId}?token=${token}`
        );

        ws.onopen = () => {
          if (!isMounted) return;
          console.log('WebSocket connected 🟢');
          setIsConnected(true);
          setConnectionStatus('Connected');
          retryCount = 0;

          // Send latest data on reconnect
          if (dataRef.current) {
            const formattedData = formatData(
              dataRef.current,
              accountIdRef.current,
              blogTopicsRef.current
            );
            ws.send(JSON.stringify(formattedData));
            setIsSaving(true);
          }
        };

        ws.onmessage = (event) => {
          setIsSaving(false);
          // Optional: Handle any incoming messages from server
        };

        ws.onclose = (event) => {
          if (!isMounted) return;
          console.log('WebSocket closed 🔴', event.code, event.reason);
          setIsConnected(false);
          setIsSaving(false);

          // Handle different close codes
          let statusMessage = 'Disconnected';
          if (event.code === 1006) {
            statusMessage = 'Connection lost unexpectedly';
          } else if (event.code === 1000) {
            statusMessage = 'Disconnected normally';
            return; // Don't reconnect for normal closure
          } else if (event.code === 1001) {
            statusMessage = 'Server going away';
          } else if (event.code === 1008 || event.code === 1002) {
            statusMessage = 'Connection failed - invalid token';
            setConnectionStatus(
              'Authentication failed. Please refresh the page.'
            );
            return; // Don't reconnect for auth issues
          }

          setConnectionStatus(statusMessage);

          // Reconnect logic with exponential backoff
          if (retryCount < MAX_RETRIES) {
            const delay = Math.min(1000 * 2 ** retryCount, 30000);
            setConnectionStatus(
              `Reconnecting in ${Math.round(delay / 1000)}s...`
            );
            reconnectTimeoutRef.current = setTimeout(() => {
              retryCount++;
              connectWebSocket();
            }, delay);
          } else {
            setConnectionStatus('Connection failed. Please refresh the page.');
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error ⭕', error);
          setConnectionStatus('Connection error occurred');
          // Don't immediately close, let onclose handle the reconnection
        };

        webSocketRef.current = ws;
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        setConnectionStatus('Failed to establish connection');
        setIsConnected(false);

        // Retry after a delay if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(1000 * 2 ** retryCount, 30000);
          setTimeout(() => {
            retryCount++;
            connectWebSocket();
          }, delay);
        }
      }
    };

    connectWebSocket();

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected && token) {
        // Reconnect immediately when tab becomes visible
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        connectWebSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, blogId, formatData]);

  // Auto-save when data changes
  useEffect(() => {
    if (!data || !isConnected || !webSocketRef.current) return;

    const formattedData = formatData(data, accountId, blogTopics);

    try {
      if (webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(JSON.stringify(formattedData));
        setIsSaving(true);
      } else if (webSocketRef.current.readyState === WebSocket.CONNECTING) {
        // Wait for connection to open, then send
        console.log('WebSocket still connecting, will send when ready');
      } else {
        console.log(
          'WebSocket not ready, state:',
          webSocketRef.current.readyState
        );
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setIsSaving(false);
      setIsConnected(false);
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Failed to save changes. Please check your connection.',
      });
    }
  }, [data, blogTopics, isConnected, accountId, formatData]);

  // Manual reconnect function
  const handleManualReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Reset connection state and try to reconnect
    setIsConnected(false);
    setConnectionStatus('Reconnecting...');

    // Close existing connection if any
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    // Trigger reconnection by updating token (this will restart the WebSocket effect)
    if (session) {
      axiosInstance
        .get('/auth/ws-token')
        .then((response) => {
          setToken(response.data.token);
        })
        .catch((error) => {
          console.error('Failed to refresh token:', error);
          setConnectionStatus('Failed to refresh connection token');
        });
    }
  }, [session]);
  const handlePublishStep = useCallback(async () => {
    if (!data || data.blocks.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Blog content cannot be empty.',
      });
      return;
    }

    setBlogPublishLoading(true);

    try {
      await axiosInstance.post(
        `/blog/publish/${blogId}`,
        formatData(data, accountId, blogTopics)
      );

      toast({
        variant: 'success',
        title: 'Blog Published Successfully',
        description: 'Your blog is now live!',
      });

      // Invalidate cache and redirect
      mutate(`/blog/my-drafts/${blogId}`);
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
  }, [data, accountId, blogId, blogTopics, formatData, router, username]);

  // Initialize editor data
  useEffect(() => {
    if (blog) {
      setData(blog.blog || { time: Date.now(), blocks: [], version: '' });
      setBlogTopics(blog.tags || []);
    }
  }, [blog]);

  // Fetch draft blog data on mount
  useEffect(() => {
    mutate(`/blog/my-drafts/${blogId}`);
  }, [blogId]);

  return (
    <>
      {isLoading ? (
        <div className='mx-auto w-full sm:w-4/5'>
          <EditorBlockSkeleton />
        </div>
      ) : (
        <div className='relative min-h-screen space-y-4'>
          <div className='p-2 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2'>
            <div className='flex items-center gap-2 text-sm'>
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  isConnected
                    ? 'bg-green-500'
                    : connectionStatus.includes('Reconnecting')
                      ? 'bg-yellow-500 animate-pulse'
                      : connectionStatus.includes('failed') ||
                          connectionStatus.includes('Authentication')
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                }`}
              />
              <span
                className={`${
                  connectionStatus.includes('failed') ||
                  connectionStatus.includes('Authentication')
                    ? 'text-red-600 dark:text-red-400'
                    : connectionStatus.includes('Reconnecting')
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : isConnected
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {connectionStatus}
              </span>

              {/* Manual reconnect button for failed connections */}
              {(connectionStatus.includes('failed') ||
                connectionStatus.includes('Authentication')) && (
                <button
                  onClick={handleManualReconnect}
                  className='ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                >
                  Reconnect
                </button>
              )}
            </div>

            <div className='flex gap-2'>
              <ChooseTopicDialog
                blogTopics={blogTopics}
                setBlogTopics={setBlogTopics}
              />

              <PublishBlogDialog
                topics={blogTopics}
                isPublishing={blogPublishLoading}
                handlePublish={handlePublishStep}
              />
            </div>
          </div>

          <div className='py-3 min-h-screen'>
            <Suspense fallback={<Loader />}>
              {data && (
                <Editor
                  data={data}
                  onChange={setData}
                  config={getEditorConfig(blogId)}
                />
              )}
            </Suspense>
          </div>

          {isSaving && (
            <div className='fixed left-1/2 -translate-x-1/2 bottom-4 p-2 z-50'>
              <div className='px-3 py-1.5 bg-foreground text-background rounded-full shadow-md flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
                <span className='text-sm'>Saving...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditPage;
