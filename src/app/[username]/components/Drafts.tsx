import useGetDraftBlog from '@/hooks/useGetDraftBlog';
import { useSession } from 'next-auth/react';

const Drafts = () => {
  const { data: session } = useSession();
  const { activities, isLoading } = useGetDraftBlog(session?.user.account_id);
  return (
    <div className='flex items-start justify-center p-4 min-h-screen'>
      <p className='font-jost italic opacity-75'>No drafts available.</p>
      {/* {
        isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className='grid grid-cols-1 gap-4 mt-4'>
            {data?.activities.map((activity) => (
              <div key={activity.id} className='p-4 bg-gray-100 rounded-md'>
                <h3 className='text-lg font-semibold'>{data.title}</h3>
                <p className='text-sm text-gray-500'>{activity.content}</p>
              </div>
            ))}
          </div>
        )
      } */}
    </div>
  );
};

export default Drafts;
