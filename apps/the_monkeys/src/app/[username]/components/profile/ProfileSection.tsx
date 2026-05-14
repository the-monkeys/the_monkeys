import { AuthorProfileCard } from '@/components/cards/author/AuthorProfileCard';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';

export const ProfileSection = ({
  paramsUser,
  user,
}: {
  paramsUser: string;
  user?: GetPublicUserProfileApiResponse;
}) => {
  return (
    <div className='gap-4'>
      <div className='p-4 '>
        <AuthorProfileCard paramsUser={paramsUser} user={user} />
      </div>
    </div>
  );
};
