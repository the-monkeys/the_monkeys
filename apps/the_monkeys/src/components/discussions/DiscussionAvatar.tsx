'use client';

import ProfileImage, {
  DefaultProfile,
  ProfileFrame,
} from '@/components/profileImage';
import { cn } from '@/lib/utils';

export function DiscussionAvatar({
  username,
  small = false,
}: {
  username: string;
  small?: boolean;
}) {
  return (
    <ProfileFrame
      className={cn(
        'shrink-0 ring-1 ring-border-light/40 dark:ring-border-dark/40',
        small ? 'size-8' : 'size-10'
      )}
    >
      {username ? <ProfileImage username={username} /> : <DefaultProfile />}
    </ProfileFrame>
  );
}
