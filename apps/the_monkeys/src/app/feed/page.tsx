import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { FeedUnavailable } from '@/components/feed/FeedUnavailable';
import FollowingFeedClient from '@/components/feed/FollowingFeedClient';
import { loginHref } from '@/lib/authRedirect';
import { loadFollowingSession } from '@/lib/followingSession';

export default async function FollowingFeedPage() {
  const session = await loadFollowingSession(cookies().toString());
  if (session.state === 'anonymous') redirect(loginHref('/feed'));
  if (session.state === 'unavailable') return <FeedUnavailable />;
  return <FollowingFeedClient viewer={session.viewer} />;
}
