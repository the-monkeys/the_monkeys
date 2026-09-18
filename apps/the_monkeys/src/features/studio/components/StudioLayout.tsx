'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const primary = [
  ['Composer', '/studio'],
  ['Calendar', '/studio/calendar'],
  ['Queue', '/studio/queue'],
  ['Accounts', '/studio/accounts'],
  ['Media', '/studio/media'],
  ['History', '/studio/history'],
];
const creative = [
  ['Snapshot', '/studio/snapshot'],
  ['Cards', '/studio/cards'],
];

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/studio'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className='mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl gap-6 px-4 py-6 lg:px-6'>
      <aside className='hidden w-56 shrink-0 lg:block'>
        <div className='sticky top-6 rounded-2xl border bg-background-light p-3 shadow-sm dark:bg-background-dark'>
          <div className='mb-4 px-3'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange'>
              Studio
            </p>
            <h1 className='font-newsreader text-2xl'>Publish with intent.</h1>
          </div>
          <nav aria-label='Studio navigation' className='space-y-1'>
            {primary.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(href)
                    ? 'bg-brand-orange text-white'
                    : 'text-foreground/70 hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50'
                }`}
              >
                {label}
              </Link>
            ))}
            <p className='px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40'>
              Creative tools
            </p>
            {creative.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(href)
                    ? 'bg-brand-orange text-white'
                    : 'text-foreground/70 hover:bg-foreground-light/50 dark:hover:bg-foreground-dark/50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <main className='min-w-0 flex-1'>
        <nav
          aria-label='Studio sections'
          className='mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden'
        >
          {[...primary, ...creative].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${
                isActive(href)
                  ? 'border-brand-orange bg-brand-orange text-white'
                  : 'text-foreground/70'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {children}
      </main>
    </div>
  );
}
