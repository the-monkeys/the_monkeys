import { AuthorProfileCard } from '@/components/cards/author/AuthorProfileCard';
import { FollowButton } from '@/components/user/buttons/followButton';
import { ShareProfileDialog } from '@/components/user/dialogs/ShareProfileDialog';
import useAuth from '@/hooks/auth/useAuth';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';

import { TopicsList } from './TopicsList';
import { UpdateDialog } from './UpdateDialog';

export const ProfileSection = ({
  paramsUser,
  user,
}: {
  paramsUser: string;
  user?: GetPublicUserProfileApiResponse;
}) => {
  const { data: session, isSuccess } = useAuth();

  const isAuthenticated = session?.username === paramsUser && isSuccess;

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='col-span-3 md:col-span-2 p-4 bg-foreground-light/10 dark:bg-foreground-dark/10 border-1 border-border-light/40 dark:border-border-dark/40 rounded-md'>
        <div className='mb-2 flex gap-2 items-center justify-end'>
          {paramsUser !== session?.username && isSuccess && (
            <FollowButton username={paramsUser} />
          )}

          {isAuthenticated && <UpdateDialog data={session} />}

          <ShareProfileDialog username={paramsUser} size={20} />
        </div>

        <AuthorProfileCard isAuthenticated={isAuthenticated} user={user} />
      </div>

      <div className='col-span-3 md:col-span-1 p-4 bg-foreground-light/10 dark:bg-foreground-dark/10 border-1 border-border-light/40 dark:border-border-dark/40 rounded-md'>
        <TopicsList topics={user?.topics} />
      </div>
    </div>
  );
};
