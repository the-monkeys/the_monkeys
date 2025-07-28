import { Metadata, ResolvingMetadata } from 'next';

import Container from '@/components/layout/Container';
import { baseUrl } from '@/constants/baseUrl';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { Blog } from '@/services/blog/blogTypes';

type Props = {
  params: { slug: string };
};

const truncateDescription = (text: string, maxLength: number): string => {
  return text.length <= maxLength
    ? text
    : `${text.slice(0, maxLength).trim()}...`;
};

const fetchBlogData = async (id: string): Promise<Blog | null> => {
  try {
    const response = await axiosInstanceV2.get<Blog>(`/blog/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch blog data for ID: ${id}`, error);
    return null;
  }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug.split('-').pop() || '';
  const blog = await fetchBlogData(id);
  const blocks = blog?.blog?.blocks || [];

  const imageBlock = blocks.find((block) => block.type === 'image');
  const descriptionBlock = blocks.find((block) => block.type === 'paragraph');

  const metaTitle = blocks[0]?.data?.text || 'Monkeys Blog';
  const metaDescription = truncateDescription(
    descriptionBlock?.data?.text || 'No description available.',
    157
  );
  const imageUrl = imageBlock?.data?.file?.url;
  const canonicalUrl = `${baseUrl}/blog/${params.slug}`;

  const parentMetadata = await parent;

  return {
    title: metaTitle || parentMetadata.title,
    description: metaDescription || parentMetadata.description,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : [],
      url: canonicalUrl,
    },
    twitter: {
      title: metaTitle,
      card: 'summary_large_image',
      description: metaDescription,
      images: imageUrl ? imageUrl : '',
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
  return <div>{children}</div>;
};

export default BlogPageLayout;
