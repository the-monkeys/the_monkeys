import { Metadata, ResolvingMetadata } from 'next';

import Container from '@/components/layout/Container';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { Blog } from '@/services/blog/blogTypes';

type Props = {
  params: { slug: string }; // Fixed the type to remove unnecessary `Promise`
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug; // Extract slug directly

  // Fetch blog data
  let blog: Blog | null = null;
  try {
    const response = await axiosInstanceV2.get<Blog>(
      `/blog/${id.split('-').pop()}`
    );
    blog = response.data;
  } catch (error) {
    console.error('Error fetching blog data:', error);
  }

  // Extract OpenGraph image
  const blocks = blog?.blog?.blocks || [];
  const imageBlock = blocks.find((block) => block.type === 'image');
  const imageUrl = imageBlock?.data?.file?.url;
  const descriptionBlock = blocks.find((block) => block.type === 'paragraph');
  console.log(imageUrl, 'imageBlock');

  // Extend parent metadata if available
  const parentMetadata = await parent;
  const previousImages = parentMetadata?.openGraph?.images || [];

  return {
    title: blocks[0]?.data?.text || 'Monkeys Blog',
    description: descriptionBlock?.data?.text || 'No description available.',
    openGraph: {
      title: blocks[0]?.data?.text || 'Monkeys Blog',
      description: descriptionBlock?.data?.text || 'No description available.',
      images: imageUrl,
    },
    twitter: {
      title: blocks[0]?.data?.text || 'Monkeys Blog',
      card: 'summary_large_image',
      description: descriptionBlock?.data?.text || 'No description available.',
      images: imageUrl,
    },
  };
}

const BlogPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className='px-4 py-5 grid grid-cols-3 gap-6 lg:gap-8'>
      {children}
    </Container>
  );
};

export default BlogPageLayout;
