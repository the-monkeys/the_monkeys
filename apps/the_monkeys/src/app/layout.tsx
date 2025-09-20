import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { LIVE_URL } from '@/constants/api';
import { TooltipProvider } from '@the-monkeys/ui/atoms/tooltip';
import { Toaster } from '@the-monkeys/ui/molecules/toaster';

import './globals.css';
import { QueryClientMount } from './query-client-mount';
import SWRProvider from './swr-provider';
import { ThemeProviders } from './theme-provider';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
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
    template: '%s | Monkeys - Collaborative Blogging & Insightful Content',
    default:
      'Monkeys - Inspire, Inform, Innovate with Collaborative Blogging and Expert Articles',
  },
  description:
    'Monkeys is your premier source for the latest technology, business, sports, entertainment, and collaborative blogging. Discover interconnected articles, expert insights, and innovative content that keeps you informed and inspired worldwide.',
  keywords: [
    'collaborative blogging',
    'technology news',
    'business insights',
    'sports updates',
    'entertainment news',
    'content writing',
    'interconnected articles',
    'topic clustering',
    'innovative content',
    'expert articles',
  ],
  openGraph: {
    title: 'Monkeys - Collaborative Blogging & Insightful Content',
    description:
      'Explore the latest in technology, business, sports, and entertainment with Monkeys. Join a collaborative platform where expert writers build interconnected, insightful articles.',
    siteName: 'Monkeys',
    url: 'https://monkeys.com.co/',
    images: [
      {
        url: 'https://monkeys.com.co/opengraph-image.png?b7ef6eff2b7766be',
        width: 1200,
        height: 630,
        alt: 'Monkeys - Collaborative Blogging Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monkeys - Collaborative Blogging & Insightful Content',
    description:
      'Stay informed with Monkeys, your go-to platform for technology, business, sports, entertainment, and collaborative articles that inspire and innovate.',
    images: ['https://monkeys.com.co/opengraph-image.png?b7ef6eff2b7766be'],
    site: '@monkeys_com_co',
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
      </head>
      <body
        className={`${dm_sans.variable} ${inter.variable} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
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
