import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

const UserPosts = () => {
  return (
    <div className='px-5 py-4'>
      <div className='flex justify-end'>
        <LinksRedirectArrow link='/activity' title='View Activity' />
      </div>
    </div>
  );
};

export default UserPosts;
