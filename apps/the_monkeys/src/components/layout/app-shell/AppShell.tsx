'use client';

import { usePathname } from 'next/navigation';

import { FeedSidebarDesktop } from '@/components/layout/Sidebar';

import Navbar from '../navbar';
import { RightRail } from './RightRail';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're on auth pages
  if (pathname?.startsWith('/auth')) {
    return <>{children}</>;
  }

  // Check if we're reading a blog post (full immersive mode)
  // Blog paths look like: /blog/title-slug-and-id
  const isBlogReading =
    pathname?.startsWith('/blog') &&
    pathname !== '/blog' &&
    !pathname?.startsWith('/blog/components') &&
    !pathname?.startsWith('/blog/utils');

  // Blog reading mode: only show main content
  if (isBlogReading) {
    return (
      <div className='mx-auto w-full max-w-[1500px]'>
        <Navbar />
        <div className='px-[10px] py-4 sm:px-4 lg:px-8 lg:py-6'>{children}</div>
      </div>
    );
  }

  const isFeed =
    pathname === '/' || pathname === '/feed' || pathname?.endsWith('/feed');
  return (
    <div className='mx-auto flex w-full max-w-[1500px] flex-col'>
      <Navbar />
      <div className='flex min-w-0 flex-1 '>
        <div className='sticky top-[60px] h-[calc(100vh-60px)] shrink-0  overflow-visible '>
          <FeedSidebarDesktop />
        </div>
        {/* Content row below navbar */}
        <div className='flex min-w-0 flex-1'>
          {/* Main content */}
          <div className='min-w-0 flex-1 px-4 py-4 lg:py-6'>{children}</div>

          {/* Right Rail - self-sticky, only visible xl+ */}
          {isFeed && <RightRail />}
        </div>
      </div>
    </div>
  );
}
