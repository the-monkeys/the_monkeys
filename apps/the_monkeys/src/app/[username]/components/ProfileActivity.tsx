'use client';

import { useState } from 'react';

import { TextTabs } from '@/components/TextTabs';
import { IUser } from '@/services/models/user';

import { Blogs } from './Blogs';
import { ProfileEvents } from './ProfileEvents';
import { ProfileGroups } from './ProfileGroups';

type Tab = 'posts' | 'events' | 'groups';

export function ProfileActivity({
  username,
  viewer,
  firstName,
}: {
  username: string;
  viewer?: IUser;
  firstName?: string;
}) {
  const [tab, setTab] = useState<Tab>('posts');

  return (
    <section className='space-y-4'>
      <h6 className='font-dm_sans text-2xl font-bold tracking-tight sm:text-3xl'>
        Latest from {firstName}
      </h6>
      <TextTabs
        aria-label='Profile activity'
        value={tab}
        onChange={setTab}
        items={[
          { id: 'posts', label: 'Posts' },
          { id: 'events', label: 'Events' },
          { id: 'groups', label: 'Groups' },
        ]}
      />
      {tab === 'posts' ? (
        <Blogs username={username} user={viewer} />
      ) : tab === 'events' ? (
        <ProfileEvents username={username} />
      ) : (
        <ProfileGroups username={username} />
      )}
    </section>
  );
}
