import { Metadata, ResolvingMetadata } from 'next';

import { API_URL_V2 } from '@/constants/api';
import { baseUrl } from '@/constants/baseUrl';
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
    const res = await fetch(`${API_URL_V2}/blog/${id}`, {
      // optional headers if needed
      headers: {
        'Content-Type': 'application/json',
      },
      // Make sure this runs server-side only
      cache: 'no-store', // or 'force-cache' if you want caching
    });

    if (!res.ok) {
      console.warn(`Blog fetch failed with status ${res.status}`);
      return null;
    }

    const data: Blog = await res.json();
    return data;
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

  const metaTitle = blocks[0]?.data?.text || 'Posted on Monkeys';
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
