import Link from 'next/link';

import ProfileImage, { ProfileFrame } from '../profileImage';

export const SearchUsers = ({ users }: { users?: SearchUser[] | null }) => {
  return (
    <div className='space-y-2'>
      <p className='pb-1 font-dm_sans font-medium text-sm sm:text-base opacity-80'>
        Profiles
      </p>

      {!users || users === null ? (
        <p className='font-roboto text-sm opacity-80 text-center'>
          No matching profiles.
        </p>
      ) : (
        <div className='flex flex-col gap-2'>
          {users.slice(0, 5).map((user) => {
            return (
              <div className='flex gap-2 items-center' key={user.username}>
                <ProfileFrame className='size-8 md:size-10'>
                  <ProfileImage
                    firstName={user.first_name}
                    username={user.username}
                  />
                </ProfileFrame>

                <div className='flex-1 overflow-hidden'>
                  <Link
                    href={`/${user?.username}`}
                    className='w-full font-roboto font-medium text-sm sm:text-base hover:opacity-80 capitalize'
                  >
                    {user?.first_name} {user?.last_name}
                  </Link>

                  <p className='font-roboto text-xs sm:text-sm opacity-80 truncate'>
                    {`@${user.username}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
