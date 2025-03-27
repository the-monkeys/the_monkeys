import { Metadata, ResolvingMetadata } from 'next';

import Container from '@/components/layout/Container';
import { baseUrl } from '@/constants/baseUrl';
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
  const fullDescription =
    descriptionBlock?.data?.text || 'No description available.';

  // Truncate description to a maximum of 160 characters
  const truncateDescription = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const metaDescription = truncateDescription(fullDescription, 157);
  const parentMetadata = await parent;
  // Construct the canonical URL

  const canonicalUrl = `${baseUrl}/blog/${id}`;

  return {
    title: blocks[0]?.data?.text || parentMetadata.title,
    description: metaDescription,
    openGraph: {
      title: blocks[0]?.data?.text || parentMetadata.description,
      description: metaDescription,
      images: imageUrl,
      url: canonicalUrl,
    },
    twitter: {
      title: blocks[0]?.data?.text || 'Monkeys Blog',
      card: 'summary_large_image',
      description: metaDescription,
      images: imageUrl,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': '/en-US',
        'de-DE': '/de-DE',
      },
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
