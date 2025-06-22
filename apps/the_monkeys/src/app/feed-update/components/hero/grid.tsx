'use client';

import React from 'react';

import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';

// Type definitions
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  categories: string[]; // changed from 'category: string'
}

type BentoCardType = 'featured' | 'medium' | 'compact' | 'horizontal';

const HeroGrid = () => {
  const { blogs } = useGetLatest100Blogs();

  // Transform API data to BlogPost format
  const transformBlogs = (blogs: any[]): BlogPost[] => {
    if (!Array.isArray(blogs)) return [];

    return blogs
      .map((blogEntry: any, index: number) => {
        const blocks = Array.isArray(blogEntry?.blog?.blocks)
          ? blogEntry.blog.blocks
          : [];

        // Extract content from blocks
        const titleBlock = blocks.find((b: any) => b.type === 'header');
        const paragraphBlock = blocks.find((b: any) => b.type === 'paragraph');
        const imageBlock = blocks.find((b: any) => b.type === 'image');

        // Only include blogs with an image
        if (!imageBlock?.data?.file?.url) return null;

        // Ensure excerpt is at least 120 characters if possible
        let excerpt =
          paragraphBlock?.data?.text?.replace(/<[^>]+>/g, '') ||
          'No excerpt available.';
        if (excerpt.length > 120) {
          excerpt = excerpt.substring(0, 120) + '...';
        }

        return {
          id: blogEntry?.id ?? index + 1000,
          title: titleBlock?.data?.text?.replace(/<[^>]+>/g, '') || 'Untitled',
          excerpt,
          image: imageBlock.data.file.url,
          categories:
            Array.isArray(blogEntry?.tags) && blogEntry.tags.length > 0
              ? blogEntry.tags
              : ['General'],
        };
      })
      .filter((blog): blog is BlogPost => blog !== null); // Type guard to ensure no nulls
  };

  const blogPosts = transformBlogs(
    Array.isArray(blogs?.blogs) ? blogs.blogs : []
  ) as BlogPost[];

  // Layout configurations for bento grid
  const layoutPresets: { gridClasses: string; type: BentoCardType }[] = [
    { gridClasses: 'col-span-4 row-span-4', type: 'featured' },
    { gridClasses: 'col-span-2 row-span-3', type: 'medium' },
    { gridClasses: 'col-span-2 row-span-3', type: 'medium' },
    { gridClasses: 'col-span-2 row-span-3', type: 'medium' },
    { gridClasses: 'col-span-2 row-span-3', type: 'compact' },
    { gridClasses: 'col-span-4 row-span-2', type: 'horizontal' },
  ];

  // Card rendering logic
  const renderCard = (
    post: BlogPost,
    type: BentoCardType = 'featured',
    gridClasses: string = ''
  ) => {
    const baseClasses =
      'overflow-hidden border border-gray-700 hover:transform hover:scale-105 transition-transform duration-300 rounded-lg';

    // Category badges (now supports multiple)
    const CategoryBadges = ({
      size = 'normal',
    }: {
      size?: 'normal' | 'small';
    }) => (
      <div className='flex flex-wrap gap-2 mb-2'>
        {post.categories.map((cat, idx) => (
          <span
            key={cat + idx}
            className={`inline-block bg-orange-600 text-white rounded-full w-fit ${size === 'small' ? 'text-xs px-2 py-1' : 'text-xs px-3 py-1 mb-1'}`}
          >
            {cat}
          </span>
        ))}
      </div>
    );

    // Card content based on type
    const getCardContent = () => {
      switch (type) {
        case 'featured':
          return (
            <>
              <img
                src={post.image}
                alt={post.title}
                className='w-full h-1/2 object-cover'
              />
              <div className='p-6 h-1/2 flex flex-col justify-between'>
                <div>
                  <CategoryBadges />
                  <h3 className='text-2xl font-bold mb-3 text-white'>
                    {post.title}
                  </h3>
                  <p className='text-gray-300 leading-relaxed'>
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </>
          );

        case 'medium':
          return (
            <>
              <img
                src={post.image}
                alt={post.title}
                className='w-full h-24 object-cover'
              />
              <div className='p-4'>
                <CategoryBadges size='small' />
                <h3 className='text-lg font-semibold mb-2 text-white'>
                  {post.title}
                </h3>
                <p className='text-sm text-gray-300'>{post.excerpt}</p>
              </div>
            </>
          );

        case 'compact':
          return (
            <>
              <img
                src={post.image}
                alt={post.title}
                className='w-full h-20 object-cover'
              />
              <div className='p-3'>
                <CategoryBadges size='small' />
                <h3 className='text-sm font-semibold mb-1 text-white'>
                  {post.title}
                </h3>
                <p className='text-xs text-gray-300'>{post.excerpt}</p>
              </div>
            </>
          );

        case 'horizontal':
          return (
            <div className='flex h-full'>
              <img
                src={post.image}
                alt={post.title}
                className='w-1/3 h-full object-cover'
              />
              <div className='w-2/3 p-4 flex flex-col justify-center'>
                <CategoryBadges size='small' />
                <h3 className='text-lg font-semibold mb-2 text-white'>
                  {post.title}
                </h3>
                <p className='text-sm text-gray-300'>{post.excerpt}</p>
              </div>
            </div>
          );

        default: // Standard card for mobile/tablet
          return (
            <>
              <img
                src={post.image}
                alt={post.title}
                className='w-full h-48 object-cover'
              />
              <div className='p-6'>
                <CategoryBadges />
                <h3 className='text-xl font-semibold mb-3 text-white'>
                  {post.title}
                </h3>
                <p className='text-gray-300 leading-relaxed'>{post.excerpt}</p>
              </div>
            </>
          );
      }
    };

    return (
      <div key={post.id} className={`${baseClasses} ${gridClasses}`}>
        {getCardContent()}
      </div>
    );
  };

  // Early return if no blog posts
  if (!blogPosts.length) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center text-gray-400'>
          <p>No blog posts available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Mobile: Single Column */}
      <div className='grid grid-cols-1 gap-6 md:hidden'>
        {blogPosts.map((post) => renderCard(post))}
      </div>

      {/* Medium: Two Columns */}
      <div className='hidden md:grid lg:hidden grid-cols-2 gap-6'>
        {blogPosts.map((post) => renderCard(post))}
      </div>

      {/* Large: Bento Grid Layout */}
      <div className='hidden lg:grid grid-cols-8 grid-rows-6 gap-6 h-[800px]'>
        {blogPosts.slice(0, layoutPresets.length).map((post, index) => {
          const { gridClasses, type } = layoutPresets[index];
          return renderCard(post, type, gridClasses);
        })}
      </div>
    </div>
  );
};

export default HeroGrid;
