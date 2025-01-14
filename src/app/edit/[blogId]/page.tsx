'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { EditorProps } from '@/components/editor';
import { Loader } from '@/components/loader';
import PublishModal from '@/components/modals/publish/PublishModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getEditorConfig } from '@/config/editor/editorjs.config';
import { WSS_URL_V2 } from '@/constants/api';
import useGetDraftBlogDetail from '@/hooks/blog/useGetDraftBlogDetail';
import axiosInstance from '@/services/api/axiosInstance';
import { OutputData } from '@editorjs/editorjs';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

const EditPage = ({ params }: { params: { blogId: string } }) => {
  const [editor, setEditor] = useState<React.FC<EditorProps> | null>(null);
  const [data, setData] = useState<OutputData | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [blogPublishLoading, setBlogPublishLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const blogId = params.blogId;

  const { blog, isLoading } = useGetDraftBlogDetail(blogId);

  const authToken = session?.user.token;
  const accountId = session?.user.account_id;

  const createWebSocket = useCallback((blogId: string, token: string) => {
    const ws = new WebSocket(
      `${WSS_URL_V2}/blog/draft/${blogId}?token=${token}`
    );

    ws.onopen = () => {
      console.log('websocket connection 🟢');
    };

    ws.onmessage = (event) => {
      console.log('websocket message 📜');
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
        tags: selectedTags,
      };
    },
    [selectedTags]
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
      router.push(`/${session?.user?.username}`);
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

  // Load the Editor component dynamically
  useEffect(() => {
    const loadEditor = async () => {
      const editor = await import('@/components/editor');
      setEditor(() => editor.default);
    };

    loadEditor();
  }, []);

  // Fetch draft blog data every time the page loads
  useEffect(() => {
    mutate(`/blog/my-drafts/${blogId}`, blogId, { revalidate: true });
  }, [mutate]);

  // Create WebSocket connection when authToken is available
  useEffect(() => {
    if (authToken) {
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

  // Set editor data based on the source
  useEffect(() => {
    if (blog) {
      setData(blog.blog);
    }
  }, [blog]);

  // Send data to WebSocket when data changes
  useEffect(() => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN && data) {
      const formattedData = formatData(data, accountId);
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
  }, [data, webSocket, accountId, formatData]);

  return (
    <>
      {isLoading ? (
        <div className='min-h-screen flex flex-col items-center gap-2'>
          <Loader />
          <p className='opacity-80'>Almost there! Preparing your editor...</p>
        </div>
      ) : (
        <div className='relative min-h-screen'>
          <div className='py-1 mx-auto w-full sm:w-4/5 flex justify-end items-center'>
            <Button size='sm' onClick={() => setShowModal(true)}>
              Publish
            </Button>
          </div>

          <div className='mt-4 min-h-screen'>
            <Suspense fallback={<Loader />}>
              {editor && data && (
                <Editor
                  data={data}
                  onChange={setData}
                  config={getEditorConfig(blogId)}
                />
              )}
            </Suspense>
          </div>

          <div className='sticky left-0 bottom-[53px] md:bottom-[0px] py-1 flex justify-between items-center bg-background-light dark:bg-background-dark border-t-1 border-foreground-light dark:border-foreground-dark z-50'>
            <div>
              {webSocket && isSaving ? (
                <p className='p-1 text-sm text-center'>Saving...</p>
              ) : (
                <p className='p-1 text-sm text-center'>Saved</p>
              )}
            </div>

            <p className='font-dm_sans text-sm text-center'>
              Editing as{' '}
              <span className='font-dm_sans font-medium'>
                {session?.user.first_name}
              </span>
            </p>
          </div>

          {showModal && (
            <PublishModal
              setModal={setShowModal}
              setSelectedTags={setSelectedTags}
              blogId={blogId}
              handlePublishStep={handlePublishStep}
              publishedBlogLoading={blogPublishLoading}
            />
          )}
        </div>
      )}
    </>
  );
};

export default EditPage;
