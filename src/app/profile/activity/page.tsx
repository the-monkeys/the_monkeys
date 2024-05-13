import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

const UserActivity = () => {
  return (
    <div className='px-5 py-4'>
      <div className='flex justify-end'>
        <LinksRedirectArrow target='/profile' title='Posts' />
      </div>
    </div>
  );
};

export default UserActivity;
