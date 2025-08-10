import type { Metadata } from 'next';
import { DM_Sans, IBM_Plex_Sans } from 'next/font/google';
import Script from 'next/script';

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { LIVE_URL } from '@/constants/api';
import { TooltipProvider } from '@the-monkeys/ui/atoms/tooltip';
import { Toaster } from '@the-monkeys/ui/molecules/toaster';

import './globals.css';
import { QueryClientMount } from './query-client-mount';
import SWRProvider from './swr-provider';
import { ThemeProviders } from './theme-provider';

const ibm_plex_sans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm_plex_sans',
  display: 'swap',
});

const dm_sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm_sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://monkeys.com.co/'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  title: {
    template: 'Monkeys - %s',
    default: 'Monkeys - Inspire, Inform, Innovate',
  },
  description:
    'Your go-to source for the latest in technology, business, sports, and entertainment — worldwide, on Monkeys.',
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: 'WIMiYru73CLiTFT9yEP2zIgQCv07AxBETTstbKe7Fws',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Monkeys',
  url: LIVE_URL,
  logo: `${LIVE_URL}/opengraph-image.png?b7ef6eff2b7766be`,
  sameAs: [
    'https://x.com/monkeys_com_co',
    'https://www.instagram.com/monkeys_com_co?igsh=ZnhjYWZqN3hidThj',
  ],
  description:
    'A collaborative blogging platform where writers contribute articles that build upon each other, creating a continuous flow of insightful content.',
  foundingDate: '2023-01-01',
  founders: [
    {
      '@type': 'Person',
      name: 'Dave Augustus',
      url: 'https://x.com/monkeys_com_co',
    },
  ],

  publisher: {
    '@type': 'Organization',
    name: 'Monkeys',
    url: LIVE_URL,
  },

  knowsAbout: [
    'Collaborative Blogging',
    'Content Writing',
    'Interconnected Articles',
    'Topic Clustering',
  ],
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4687427997504601'
          crossOrigin='anonymous'
        ></Script>
        {/* <AdSense pId='4687427997504601' /> */}
      </head>
      <body
        className={`${dm_sans.variable} ${ibm_plex_sans.variable} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
      >
        <Toaster />
        <SWRProvider>
          <QueryClientMount>
            <ThemeProviders>
              <TooltipProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </TooltipProvider>
            </ThemeProviders>
          </QueryClientMount>
        </SWRProvider>
      </body>
    </html>
  );
};

export default RootLayout;
