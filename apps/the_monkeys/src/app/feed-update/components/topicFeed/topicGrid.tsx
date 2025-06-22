interface TopicGridProps {
  title: string;
  trendingTopics: string[];
  blogs: {
    title: string;
    description: string;
    img: string;
  }[];
}

export default function TopicGrid({
  title,
  trendingTopics,
  blogs,
}: TopicGridProps) {
  return (
    <div className='text-white min-h-screen p-6'>
      <h1 className='text-3xl font-bold mb-6'>{title}</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4'>
        {/* Trending Topics */}
        <div className='lg:col-span-2 md:col-span-2 col-span-1 bg-orange-900 rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Trending topics</h2>
          <ul className='space-y-2'>
            {trendingTopics.map((topic, idx) => (
              <li
                key={idx}
                className={`${
                  idx === 0 ? 'text-2xl' : idx === 1 ? 'text-lg' : 'text-base'
                }`}
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Blog Cards */}
        {blogs.map((blog, idx) => (
          <div
            key={idx}
            className='lg:col-span-2 md:col-span-1 col-span-1 bg-gray-800 rounded-lg overflow-hidden'
          >
            <img
              src={blog.img}
              alt={blog.title}
              className='w-full h-40 object-cover'
            />
            <div className='p-4'>
              <h2 className='text-lg font-semibold'>{blog.title}</h2>
              <p className='text-sm mt-2 text-gray-300'>{blog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
