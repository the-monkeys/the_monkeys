import React from 'react';

// Type definitions
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
}

interface CategoryBadgeProps {
  category: string;
  size?: 'normal' | 'small';
}

interface StandardCardProps {
  post: BlogPost;
}

type BentoCardType = 'featured' | 'medium' | 'compact' | 'horizontal';

interface BentoCardProps {
  post: BlogPost;
  gridClasses: string;
  type: BentoCardType;
}

interface BentoCardConfig {
  post: BlogPost;
  gridClasses: string;
  type: BentoCardType;
}

const HeroGrid = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Web Development',
      excerpt:
        'Exploring the latest trends and technologies shaping the future of web development, from AI integration to advanced frameworks.',
      image: 'https://picsum.photos/600/400?random=1',
      category: 'Technology',
    },
    {
      id: 2,
      title: 'Mastering React Hooks',
      excerpt:
        'A comprehensive guide to understanding and implementing React hooks in modern applications.',
      image: 'https://picsum.photos/400/300?random=2',
      category: 'Programming',
    },
    {
      id: 3,
      title: 'Design Systems at Scale',
      excerpt:
        'How to build and maintain design systems that work across large organizations.',
      image: 'https://picsum.photos/400/300?random=3',
      category: 'Design',
    },
    {
      id: 4,
      title: 'Mobile-First Development',
      excerpt:
        'Best practices for creating responsive web applications with a mobile-first approach.',
      image: 'https://picsum.photos/500/350?random=4',
      category: 'Mobile',
    },
    {
      id: 5,
      title: 'UI/UX Trends 2024',
      excerpt:
        'The latest design trends that are defining user experiences in 2024.',
      image: 'https://picsum.photos/400/300?random=5',
      category: 'Design',
    },
    {
      id: 6,
      title: 'Performance Optimization',
      excerpt: 'Techniques to improve website performance and user experience.',
      image: 'https://picsum.photos/400/300?random=6',
      category: 'Performance',
    },
  ];

  // Shared card base classes
  const cardBaseClasses =
    'bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:shadow-xl transition-shadow duration-300';

  // Category badge component
  const CategoryBadge: React.FC<CategoryBadgeProps> = ({
    category,
    size = 'normal',
  }) => (
    <span
      className={`inline-block bg-orange-600 text-white rounded-full mb-2 w-fit ${
        size === 'small' ? 'text-xs px-2 py-1' : 'text-xs px-3 py-1 mb-3'
      }`}
    >
      {category}
    </span>
  );

  // Standard card component for mobile and tablet
  const StandardCard: React.FC<StandardCardProps> = ({ post }) => (
    <div className={cardBaseClasses}>
      <img
        src={post.image}
        alt={post.title}
        className='w-full h-48 object-cover'
      />
      <div className='p-6'>
        <CategoryBadge category={post.category} />
        <h3 className='text-xl font-semibold mb-3 text-white'>{post.title}</h3>
        <p className='text-gray-300 leading-relaxed'>{post.excerpt}</p>
      </div>
    </div>
  );

  // Desktop bento grid card configurations
  const bentoCardConfigs: BentoCardConfig[] = [
    {
      post: blogPosts[0],
      gridClasses: 'col-span-4 row-span-4',
      type: 'featured',
    },
    {
      post: blogPosts[1],
      gridClasses: 'col-span-2 row-span-3',
      type: 'medium',
    },
    {
      post: blogPosts[2],
      gridClasses: 'col-span-2 row-span-3',
      type: 'medium',
    },
    {
      post: blogPosts[4],
      gridClasses: 'col-span-2 row-span-3',
      type: 'medium',
    },
    {
      post: blogPosts[5],
      gridClasses: 'col-span-2 row-span-3',
      type: 'compact',
    },
    {
      post: blogPosts[3],
      gridClasses: 'col-span-4 row-span-2',
      type: 'horizontal',
    },
  ];

  // Bento card component
  const BentoCard: React.FC<BentoCardProps> = ({ post, gridClasses, type }) => {
    const renderCardContent = (): JSX.Element | null => {
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
                  <CategoryBadge category={post.category} />
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
                <CategoryBadge category={post.category} size='small' />
                <h3 className='text-lg font-semibold mb-2 text-white'>
                  {post.title}
                </h3>
                <p className='text-sm text-gray-300'>
                  {post.excerpt.substring(0, 60)}...
                </p>
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
                <CategoryBadge category={post.category} size='small' />
                <h3 className='text-sm font-semibold mb-1 text-white'>
                  {post.title}
                </h3>
                <p className='text-xs text-gray-300'>
                  {post.excerpt.substring(0, 40)}...
                </p>
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
                <CategoryBadge category={post.category} size='small' />
                <h3 className='text-lg font-semibold mb-2 text-white'>
                  {post.title}
                </h3>
                <p className='text-sm text-gray-300'>
                  {post.excerpt.substring(0, 80)}...
                </p>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className={`${cardBaseClasses} ${gridClasses}`}>
        {renderCardContent()}
      </div>
    );
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Mobile: Single Column */}
      <div className='grid grid-cols-1 gap-6 md:hidden'>
        {blogPosts.map((post) => (
          <StandardCard key={post.id} post={post} />
        ))}
      </div>

      {/* Medium: Two Columns */}
      <div className='hidden md:grid lg:hidden grid-cols-2 gap-6'>
        {blogPosts.map((post) => (
          <StandardCard key={post.id} post={post} />
        ))}
      </div>

      {/* Large: Bento Grid Layout */}
      <div className='hidden lg:grid grid-cols-8 grid-rows-6 gap-6 h-[800px]'>
        {bentoCardConfigs.map((config, index) => (
          <BentoCard
            key={config.post.id}
            post={config.post}
            gridClasses={config.gridClasses}
            type={config.type}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroGrid;
