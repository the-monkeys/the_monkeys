import { useParams } from 'next/navigation';

import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import useUser from '@/hooks/useUser';
import { useSession } from 'next-auth/react';

const TopicsCard = () => {
  const params = useParams<{ username: string }>();

  const { data, status } = useSession();

  const { user, isLoading, isError } = useUser(params.username);

  if (isLoading) {
    return <Loader className='m-auto' />;
  }

  return (
    <div className='space-y-3'>
      <h2 className='mb-2 font-josefin_Sans font-semibold text-lg sm:text-xl'>
        My Topics
      </h2>

      {user && user.topics && user.topics.length > 0 ? (
        <div className='flex flex-wrap gap-x-1 gap-y-2'>
          {user.topics?.slice(0, 6).map((topic, index) => (
            <Badge variant='outline' key={index} className='text-sm py-1'>
              {topic}
            </Badge>
          ))}

          <p className='px-1 self-center font-jost text-sm opacity-75'>
            {`(${user.topics.length})`}
          </p>
        </div>
      ) : (
        <p className='font-jost text-sm text-center opacity-75'>
          You haven't added any topics to your profile.
        </p>
      )}

      {data?.user.username === params.username &&
        status === 'authenticated' && (
          <LinksRedirectArrow
            link='/explore-topics'
            position='Right'
            className='w-fit'
          >
            <p className='font-jost'>Add/Explore Topics</p>
          </LinksRedirectArrow>
        )}
    </div>
  );
};

export default TopicsCard;
