import type { ReactNode } from 'react';

import { DiscussionDiscoveryRail } from '@/components/discussions/DiscussionDiscoveryRail';

export default function DiscussionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='grid min-w-0 items-start gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_280px] lg:pb-0 xl:grid-cols-[minmax(0,1fr)_320px]'>
      <div className='min-w-0'>{children}</div>
      <div className='min-w-0'>
        <DiscussionDiscoveryRail />
      </div>
    </div>
  );
}
