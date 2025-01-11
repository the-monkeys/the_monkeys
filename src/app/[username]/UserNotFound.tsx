import { DefaultProfile } from '@/components/profileImage';
import { SearchInput } from '@/components/search/SearchInput';

const UserNotFound = () => {
  return (
    <>
      <div className='mb-6 space-y-2'>
        <div className='mx-auto size-[80px] ring-1 ring-border-light/25 dark:ring-border-dark/25 rounded-full overflow-hidden'>
          <DefaultProfile />
        </div>

        <h4 className='font-arvo text-2xl md:text-3xl text-center text-alert-red'>
          404
        </h4>

        <p className='text-sm text-center'>
          The author you&apos;re looking for isn&apos;t available. Try searching
          for someone else.
        </p>
      </div>

      <SearchInput className='w-full' />
    </>
  );
};

export default UserNotFound;
