import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import Script from 'next/script';

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { LIVE_URL } from '@/constants/api';
import { TooltipProvider } from '@the-monkeys/ui/atoms/tooltip';
import { Toaster } from '@the-monkeys/ui/molecules/toaster';

import './globals.css';
import GrowthbookClientProvider from './growthbook-provider';
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
    template:
      '%s | Monkeys - Quality Blogging Community & Trusted Content Platform',
    default:
      'Monkeys - Inspire, Inform, Innovate with Quality Blogs, Expert Articles & Trusted Content',
  },
  description:
    'Monkeys is a trusted blogging community where writers publish meaningful, accurate, and valuable content. Explore quality blogs in science, technology, philosophy, lifestyle, and more.',
  keywords: [
    'quality blogging platform',
    'trusted content community',
    'publish blogs online',
    'expert articles',
    'science blogs',
    'technology blogs',
    'philosophy blogs',
    'lifestyle blogs',
    'personal development articles',
    'collaborative writing',
  ],
  openGraph: {
    title: 'Monkeys - Quality Blogging Community & Trusted Content Platform',
    description:
      'Join Monkeys, a community for thoughtful voices and meaningful blogs. Publish and read expert articles across science, philosophy, technology, lifestyle, and more.',
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
    title: 'Monkeys - Quality Blogging Community & Trusted Content Platform',
    description:
      'Monkeys is where writers publish meaningful blogs and readers discover trusted content across science, lifestyle, philosophy, and more.',
    images: ['https://monkeys.com.co/opengraph-image.png?b7ef6eff2b7766be'],
    site: '@monkeys_com_co',
  },
  verification: {
    google: 'WIMiYru73CLiTFT9yEP2zIgQCv07AxBETTstbKe7Fws',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
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
        {/* Microsoft Clarity */}
        <Script id='microsoft-clarity' strategy='afterInteractive'>
          {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "terxckyygm");
      `}
        </Script>
      </head>
      <body
        className={`${dm_sans.variable} ${inter.variable} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
      >
        <Toaster />
        <GrowthbookClientProvider>
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
        </GrowthbookClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
