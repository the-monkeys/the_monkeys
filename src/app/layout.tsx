import type { Metadata } from 'next';
import { DM_Sans, Inter, Playfair_Display, Roboto } from 'next/font/google';

import AdSense from '@/components/AdSense/AdSense';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';

import Providers from './Providers';
import './globals.css';
import SWRProvider from './swr-provider';
import { ThemeProviders } from './theme-provider';

const playfair_Display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair_Display',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['100', '300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const dm_sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm_sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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

const RootLayout = ({
  auth,
  children,
}: Readonly<{
  auth: React.ReactNode;
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <AdSense pId='4687427997504601' />
      </head>
      <body
        className={`${playfair_Display.variable} ${roboto.variable} ${dm_sans.variable} ${inter.variable} bg-background-light dark:bg-background-dark`}
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
};

export default RootLayout;
