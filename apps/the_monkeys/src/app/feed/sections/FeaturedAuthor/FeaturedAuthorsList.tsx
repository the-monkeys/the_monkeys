'use client';

import { Suspense, forwardRef, useRef } from 'react';

import { FeaturedAuthorStory } from './FeaturedAuthorStory';
import { FeaturedAuthorStorySkeleton } from './FeaturedAuthorStorySkeleton';

interface FeaturedAuthorsListProps {
  users: Array<{ userID: string }>;
}

/**
 * Individual author story item wrapper with Suspense boundary
 */
function AuthorStoryItem({ userId }: { userId: string }) {
  return (
    <Suspense fallback={<FeaturedAuthorStorySkeleton />}>
      <FeaturedAuthorStory userId={userId} />
    </Suspense>
  );
}

/**
 * Featured Authors List Component
 * Displays a horizontal scrollable list of featured author stories
 * with loading skeletons for each item
 * Hides scrollbar and uses ref for navigation control
 */
export const FeaturedAuthorsList = forwardRef<
  HTMLDivElement,
  FeaturedAuthorsListProps
>(({ users }, ref) => {
  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className='flex gap-4 overflow-x-auto pb-2 scroll-smooth'
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Hide scrollbar for webkit browsers */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {users.map((user) => (
        <AuthorStoryItem key={user.userID} userId={user.userID} />
      ))}
    </div>
  );
});
FeaturedAuthorsList.displayName = 'FeaturedAuthorsList';
