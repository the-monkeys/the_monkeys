'use client';

import { useState } from 'react';

import StudioHeader from './StudioHeader';
import StudioMobileNav from './StudioMobileNav';
import StudioSidebar from './StudioSidebar';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className='flex min-h-[calc(100vh-60px)] w-full bg-background-light dark:bg-background-dark'>
      {/* Desktop Sticky Sidebar (w-64) */}
      <aside className='hidden lg:block w-64 shrink-0 sticky top-[60px] h-[calc(100vh-60px)]'>
        <StudioSidebar />
      </aside>

      {/* Main Workspace Container */}
      <div className='flex min-w-0 flex-1 flex-col'>
        <StudioHeader onOpenMobileMenu={() => setIsDrawerOpen(true)} />

        {/* Content Canvas */}
        <main className='mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 pb-24 lg:pb-8'>
          {children}
        </main>

        {/* Mobile Navigation (< lg) */}
        <StudioMobileNav
          isDrawerOpen={isDrawerOpen}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onCloseDrawer={() => setIsDrawerOpen(false)}
        />
      </div>
    </div>
  );
}
