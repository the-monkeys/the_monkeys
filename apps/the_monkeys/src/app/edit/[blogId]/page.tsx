'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { PublishBlogDialog } from '@/components/blog/actions/PublishBlogDialog';
import { EditorProps } from '@/components/editor';
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
});

const EditPage = ({ params }: { params: { blogId: string } }) => {
  const blogId = params.blogId;
  const { data: session } = useAuth();
  const router = useRouter();

  const { blog, isLoading } = useGetDraftBlogDetail(blogId);

  // editor states
  const [editor, setEditor] = useState<React.FC<EditorProps> | null>(null);
  const [data, setData] = useState<OutputData | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [blogPublishLoading, setBlogPublishLoading] = useState(false);
  const [blogTopics, setBlogTopics] = useState<string[]>([]);
  const [token, setToken] = useState<string>();

  const accountId = session?.account_id;
  const username = session?.username;

  useEffect(() => {
    if (!session) return;

    axiosInstance.get('/auth/ws-token').then((res) => {
      setToken(res.data.token);
    });
  }, [session]);

  const createWebSocket = useCallback((blogId: string) => {
    if (!token) return;

    const ws = new WebSocket(
      `${WSS_URL_V2}/blog/draft/${blogId}?token=${token}`
    );

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

  const handlePublishStep = useCallback(async () => {
    if (!data || data.blocks.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Blog content cannot be empty.',
      });

      return; // Ensure data is not null and not empty
    }

    const formattedData = formatData(data, accountId);

    setBlogPublishLoading(true);

    try {
      await axiosInstance.post(`/blog/publish/${blogId}`, formattedData);

      toast({
        variant: 'success',
        title: 'Blog Published successfully',
        description: 'Your blog has been published successfully!',
      });

      setBlogPublishLoading(false);
      router.push(`/${username}`);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error publishing blog',
        description:
          'There was an error while publishing your blog. Please try again.',
      });
    } finally {
      setBlogPublishLoading(false);
    }
  }, [data, accountId, blogId, formatData, router]);

  // Fetch draft blog data every time the page loads
  useEffect(() => {
    mutate(`/blog/my-drafts/${blogId}`, blogId, { revalidate: true });
  }, [mutate]);

  // Create WebSocket connection when authToken is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanup = createWebSocket(blogId);

      const handleBeforeUnload = () => {
        cleanup?.();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        cleanup?.();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [blogId, createWebSocket]);

  // Set editor data based on the source
  useEffect(() => {
    if (blog) {
      setData(blog.blog);
      setBlogTopics(blog.tags);
    }
  }, [blog]);

  // Send data to WebSocket when data changes
  useEffect(() => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN && data) {
      const formattedData = formatData(data, accountId);
      webSocket.send(JSON.stringify(formattedData));

      setIsSaving(true); // Set saving status when data is sent
    }

    if (webSocket && webSocket.readyState === WebSocket.CLOSED && data) {
      setTimeout(() => {
        const cleanup = createWebSocket(blogId);

        return () => {
          cleanup?.();
        };
      }, 1000);
    }
  }, [data, blogTopics, webSocket, accountId, formatData]);

  return (
    <>
      {isLoading ? (
        <div className='mx-auto w-full sm:w-4/5'>
          <EditorBlockSkeleton />
        </div>
      ) : (
        <div className='relative min-h-screen space-y-4'>
          <div className='p-2 flex justify-center items-center gap-[6px]'>
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

          {webSocket && isSaving && (
            <div className='sticky w-fit left-[50%] -translate-x-[50%] bottom-[53px] md:bottom-4 p-2 z-[99]'>
              <div className='px-[10px] py-1 bg-foreground-light dark:bg-foreground-dark rounded-md'>
                <p className='text-sm text-center'>Saving blog...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EditPage;
