import type { Metadata } from 'next';
import { Josefin_Sans, Jost, Playfair_Display } from 'next/font/google';

import AdSense from '@/components/AdSense/AdSense';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';

import Providers from './Providers';
import './globals.css';
import SWRProvider from './swr-provider';
import { ThemeProviders } from './theme-provider';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
});

const josefin_Sans = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin_Sans',
  display: 'swap',
});

const playfair_Display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair_Display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://themonkeys.live/'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  title: {
    template: '%s - Monkeys',
    default: 'Collaborate on Blogs and Showcase Your Thoughts - Monkeys',
  },
  description:
    'Join Monkeys for collaborative blog writing, blog version control, diverse topics and staying updated with ongoing global headlines.',
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: '-aw7tEMRsboqWp8YhQwHAT2tEddw1uk_FPS3F3hvRic',
  },
};

export default function RootLayout({
  auth,
  children,
}: Readonly<{
  auth: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <AdSense pId='4687427997504601' />
      </head>
      <body
        className={`${jost.variable} ${josefin_Sans.variable} bg-primary-monkeyWhite dark:bg-primary-monkeyBlack ${playfair_Display.variable}`}
      >
        <Toaster />
        <SWRProvider>
          <Providers>
            <ThemeProviders>
              <Navbar />
              <div>{auth}</div>
              <main>{children}</main>
              <Footer />
            </ThemeProviders>
          </Providers>
        </SWRProvider>
      </body>
    </html>
  );
}
