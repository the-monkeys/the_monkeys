import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { RiCloseLine, RiMenu4Line } from '@remixicon/react';

import Container from './layout/Container';

const navLinks = [
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Cookie Policy', href: '/cookies' },
];

const LegalPage = ({
  title,
  date,
  content,
}: {
  title: string;
  date: string;
  content: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(currentScroll / totalScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isDrawerOpen]);

  return (
    <div className='relative min-h-screen bg-background-light dark:bg-background-dark'>
      {/* Scroll Progress Bar */}
      <div
        className='fixed top-0 left-0 z-[60] h-1.5 w-full bg-brand-orange origin-left transition-transform duration-75 ease-out'
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Mobile Floating Menu Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className='lg:hidden fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-2xl shadow-brand-orange/40 transition-transform active:scale-90 animate-appear-up'
        aria-label='Legal Menu'
      >
        <RiMenu4Line className='h-6 w-6' />
      </button>

      {/* Mobile Navigation Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[100] transition-opacity duration-300 lg:hidden',
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div
          className='absolute inset-0 bg-background-dark/60 backdrop-blur-sm'
          onClick={() => setIsDrawerOpen(false)}
        />
        <aside
          className={cn(
            'absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white dark:bg-foreground-dark p-8 shadow-2xl transition-transform duration-500 ease-out',
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className='flex items-center justify-between mb-12'>
            <h3 className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
              Legal Navigation
            </h3>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className='p-2 rounded-xl bg-background-light dark:bg-background-dark/50'
            >
              <RiCloseLine className='h-5 w-5' />
            </button>
          </div>

          <nav className='flex flex-col space-y-3'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsDrawerOpen(false)}
                className={cn(
                  'px-6 py-4 rounded-2xl text-lg font-bold transition-all duration-300 border-1',
                  pathname === link.href
                    ? 'bg-brand-orange text-white border-brand-orange shadow-xl shadow-brand-orange/20'
                    : 'text-text-light/60 dark:text-text-dark/60 border-transparent bg-background-light/50 dark:bg-background-dark/30'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <Container className='py-20 px-6 sm:px-10 lg:px-16'>
        <div className='flex flex-col lg:flex-row gap-12 lg:items-start'>
          {/* Desktop Sidebar Navigation */}
          <aside className='hidden lg:block lg:w-72 lg:sticky lg:top-28 space-y-8 animate-appear-up'>
            <h3 className='text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6'>
              Legal Documents
            </h3>
            <nav className='flex flex-col space-y-1 text-sm font-medium'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-xl transition-all duration-300 border-1',
                    pathname === link.href
                      ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20'
                      : 'text-text-light/60 dark:text-text-dark/60 hover:text-brand-orange border-transparent hover:bg-white dark:hover:bg-foreground-dark/30 hover:shadow-sm'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className='flex-grow max-w-4xl animate-appear-up delay-100'>
            <div className='relative overflow-hidden group'>
              {/* Glassmorphism Card */}
              <div className='absolute inset-0 bg-white/40 dark:bg-foreground-dark/40 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-white/5 shadow-2xl transition-all duration-500 group-hover:shadow-brand-orange/5' />

              <div className='relative p-6 sm:p-12 lg:p-16 space-y-10 sm:space-y-12'>
                {/* Header Section */}
                <header className='space-y-6'>
                  <h1 className='text-3xl sm:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-text-light to-text-light/60 dark:from-text-dark dark:to-text-dark/40'>
                    {title}
                  </h1>
                  <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest'>
                    <div className='flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full border border-brand-orange/20'>
                      <span className='w-2 h-2 rounded-full bg-brand-orange animate-pulse' />
                      Effective Version
                    </div>
                    <span className='text-muted-foreground'>
                      Last Updated: {date}
                    </span>
                  </div>
                </header>

                {/* Content with Enhanced Typography */}
                <div
                  className='prose prose-base sm:prose-lg dark:prose-invert max-w-none 
                  prose-headings:font-black prose-headings:tracking-tight
                  prose-p:text-text-light/80 dark:prose-p:text-text-dark/80 prose-p:leading-relaxed
                  prose-strong:text-brand-orange
                  prose-li:text-text-light/70 dark:prose-li:text-text-dark/70
                  prose-hr:border-border-light/50 dark:prose-hr:border-border-dark/50
                '
                >
                  {content}
                </div>

                <footer className='pt-12 border-t border-border-light/20 dark:border-border-dark/20 text-center'>
                  <p className='text-sm text-muted-foreground'>
                    Questions about our legal terms?{' '}
                    <br className='sm:hidden' />
                    Reach out at{' '}
                    <Link
                      href='mailto:monkeys.admin@monkeys.com.co'
                      className='text-brand-orange font-bold hover:underline'
                    >
                      monkeys.admin@monkeys.com.co
                    </Link>
                  </p>
                </footer>
              </div>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
};

export default LegalPage;
