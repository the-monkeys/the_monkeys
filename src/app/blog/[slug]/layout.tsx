import { Metadata, ResolvingMetadata } from 'next';

import Container from '@/components/layout/Container';
import { baseUrl } from '@/constants/baseUrl';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { Blog } from '@/services/blog/blogTypes';
import DOMPurify from 'isomorphic-dompurify';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug;

  let blog: Blog | null = null;
  try {
    const response = await axiosInstanceV2.get<Blog>(
      `/blog/${id.split('-').pop()}`
    );
    blog = response.data;
  } catch (error) {
    console.error('Error fetching blog data:', error);
  }

  const blocks = blog?.blog?.blocks || [];
  const imageBlock = blocks.find((block) => block.type === 'image');
  const imageUrl = imageBlock?.data?.file?.url;
  const descriptionBlock = blocks.find((block) => block.type === 'paragraph');
  const fullDescription =
    descriptionBlock?.data?.text || 'No description available.';

  const truncateDescription = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const metaDescription = truncateDescription(fullDescription, 157);
  const parentMetadata = await parent;

  const canonicalUrl = `${baseUrl}/blog/${id}`;

  // Sanitize title and description using `isomorphic-dompurify`
  const rawTitle = blocks[0]?.data?.text || parentMetadata.title;
  const sanitizedTitle = DOMPurify.sanitize(rawTitle);
  const sanitizedDescription = DOMPurify.sanitize(metaDescription);

  return {
    title: sanitizedTitle,
    description: sanitizedDescription,
    openGraph: {
      title: sanitizedTitle,
      description: sanitizedDescription,
      images: imageUrl,
      url: canonicalUrl,
    },
    twitter: {
      title: sanitizedTitle || 'Monkeys Blog',
      card: 'summary_large_image',
      description: sanitizedDescription,
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
