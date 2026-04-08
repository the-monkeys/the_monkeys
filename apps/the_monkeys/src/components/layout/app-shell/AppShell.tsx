'use client';

import { usePathname } from 'next/navigation';

import {
  FeedSidebarDesktop,
  FeedSidebarMobile,
} from '@/components/layout/feed/FeedSidebar';

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
      <div className='mx-auto w-full max-w-[1000px]'>
        <div className='px-[10px] py-4 sm:px-4 lg:px-8 lg:py-6'>{children}</div>
      </div>
    );
  }

  return (
    <div className='mx-auto flex w-full max-w-[1500px] flex-col lg:flex-row'>
      {/* Mobile menu for sidebar */}
      <div className='flex items-center justify-between px-[10px] py-3 lg:hidden'>
        <FeedSidebarMobile />
      </div>

      {/* Left Sidebar - sticky full height */}
      <div className='hidden lg:block sticky top-0 h-screen shrink-0 border-r-[0.5px] border-border-light dark:border-border-dark overflow-visible'>
        <FeedSidebarDesktop />
      </div>

      {/* Center + Right: flex col, navbar spans full width */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <Navbar />

        {/* Content row below navbar */}
        <div className='flex min-w-0 flex-1'>
          {/* Main content */}
          <div className='min-w-0 flex-1 px-4 py-4 lg:py-6'>{children}</div>

          {/* Right Rail - self-sticky, only visible xl+ */}
          <RightRail />
        </div>
      </div>
    </div>
  );
}
