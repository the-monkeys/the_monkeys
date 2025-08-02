import { Metadata, ResolvingMetadata } from 'next';

import { API_URL_V2 } from '@/constants/api';
import { baseUrl } from '@/constants/baseUrl';
import { Blog } from '@/services/blog/blogTypes';

type Props = {
  params: { slug: string };
};

const MAX_DESCRIPTION_LENGTH = 157;

const truncateDescription = (
  text: string,
  maxLength: number = MAX_DESCRIPTION_LENGTH
): string => {
  if (!text) return '';
  const trimmed = text.trim();
  return trimmed.length <= maxLength
    ? trimmed
    : `${trimmed.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
};

const fetchBlogData = async (id: string): Promise<Blog | null> => {
  try {
    const res = await fetch(`${API_URL_V2}/blog/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },

      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Blog fetch failed for ID ${id} with status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch blog data for ID: ${id}`, error);
    return null;
  }
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug.split('-').pop() || '';
  const blog = await fetchBlogData(id);

  const parentMetadata = await parent;
  const defaultTitle = 'Published Post | Monkeys';
  const defaultDescription =
    'Discover insightful articles and latest updates on our blog.';
  const siteName = 'Monkeys';

  const blocks = blog?.blog?.blocks || [];
  const titleBlock =
    blocks.find((block) => block.type === 'header') || blocks[0];
  const descriptionBlock = blocks.find((block) => block.type === 'paragraph');
  const imageBlock = blocks.find((block) => block.type === 'image');

  // Prepare metadata values
  const metaTitle = titleBlock?.data?.text
    ? `${titleBlock.data.text} | ${siteName}`
    : defaultTitle;

  const metaDescription = truncateDescription(
    descriptionBlock?.data?.text || defaultDescription
  );

  const imageUrl = imageBlock?.data?.file?.url
    ? new URL(imageBlock.data.file.url, baseUrl).toString()
    : `${baseUrl}/default-blog-image.jpg`;

  const canonicalUrl = `${baseUrl}/blog/${params.slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: blog?.tags?.join(', ') || '',
    openGraph: {
      type: 'article',
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      url: canonicalUrl,
      siteName,
      publishedTime: blog?.published_time || new Date().toISOString(),
      authors: blog?.owner_account_id ? [] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: imageUrl,
      creator: blog?.owner_account_id || '@yourtwitter',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': '/en-US',
        'de-DE': '/de-DE',
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },

    ...(blog?.published_time && {
      publishedTime: blog?.published_time,
    }),
    ...(blog?.published_time && {
      modifiedTime: blog?.published_time,
    }),
  };
}

const BlogPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='min-h-[800px] container mx-auto px-4'>
      <article itemScope itemType='https://schema.org/BlogPosting'>
        {children}
      </article>
    </main>
  );
};

export default BlogPageLayout;
