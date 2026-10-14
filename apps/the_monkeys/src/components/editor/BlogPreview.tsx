import dynamic from 'next/dynamic';

import {
  BlogHeading,
  withoutPostTitle,
} from '@/components/blog/getBlogContent';
import { PostArticleCanvas } from '@/components/editor/postCanvas/PostArticleCanvas';
import Container from '@/components/layout/Container';
import { EditorBlockSkeleton } from '@/components/skeletons/blogSkeleton';
import { UserInfoCardBlogPage } from '@/components/user/userInfo';
import useAuth from '@/hooks/auth/useAuth';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { OutputData } from '@themonkeys/monkeys-editor';
import moment from 'moment';

const Editor = dynamic(() => import('@/components/editor/preview'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

interface BlogPreviewProps {
  urlBlogId: string;
  data?: OutputData;
}

const BlogPreview = ({ urlBlogId, data }: BlogPreviewProps) => {
  const { data: session } = useAuth();
  const date = new Date();
  const sanitizedBlogTitle = purifyHTMLString(data?.blocks[0]?.data?.text);

  return (
    <>
      <div className='px-4'>
        <Container className='pt-4 sm:pt-6 pb-6 max-w-3xl flex flex-col items-center gap-3 border-b-1 border-border-light/80 dark:border-border-dark/80'>
          <p className='text-sm opacity-90'>
            {moment(date).format('MMM DD, yyyy')}
            {' / '}
            {moment(date).utc().format('hh:mm A')} UTC
          </p>

          <BlogHeading
            title={sanitizedBlogTitle || 'Untitled Post'}
            className='pt-1 pb-4 font-dm_sans font-semibold text-[28px] sm:text-3xl md:text-4xl !leading-[1.32] text-center'
          />

          <UserInfoCardBlogPage id={session?.account_id} />
        </Container>
      </div>
      <div className='p-4'>
        <Container className='max-w-3xl'>
          <PostArticleCanvas className='px-1 pb-4 overflow-hidden'>
            <Editor key={urlBlogId} data={withoutPostTitle(data)} />
          </PostArticleCanvas>
        </Container>
      </div>
    </>
  );
};

export default BlogPreview;
