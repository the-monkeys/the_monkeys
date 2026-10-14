import type { Metadata } from 'next';
import {
  DM_Sans,
  Inter,
  JetBrains_Mono,
  Montserrat,
  Newsreader,
  Playfair_Display,
  Poppins,
  Raleway,
  Roboto_Slab,
} from 'next/font/google';
import Script from 'next/script';

import { AppShell } from '@/components/layout/app-shell/AppShell';
import Footer from '@/components/layout/footer';
import DonationPopup from '@/components/popup/DonationPopup';
import { TooltipProvider } from '@the-monkeys/ui/atoms/tooltip';
import { Toaster } from '@the-monkeys/ui/molecules/toaster';
import { PublicEnvScript } from 'next-runtime-env';

import './globals.css';
import GrowthbookClientProvider from './growthbook-provider';
import { QueryClientMount } from './query-client-mount';
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

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: false,
});

// Business Card studio fonts, loaded so the card "Font Family" control renders
// the real typefaces instead of falling back to system Arial/Georgia.
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  preload: false,
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  display: 'swap',
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://monkeys.com.co/'),
  title: {
    template: '%s | Monkeys',
    default: 'Monkeys | Posts, Events and Communities',
  },
  description:
    'Discover thoughtful posts, explore topics, meet people at community events, and join groups built around shared interests on Monkeys.',
  keywords: [
    'content and community platform',
    'thoughtful posts',
    'community events',
    'interest based groups',
    'topic discovery',
    'authors and creators',
  ],
  openGraph: {
    title: 'Monkeys | Posts, Events and Communities',
    description:
      'Discover thoughtful posts, explore topics, attend community events, and join groups built around shared interests.',
    siteName: 'Monkeys',
    url: 'https://monkeys.com.co/',
    images: [
      {
        url: 'https://monkeys.com.co/opengraph-image.png?b7ef6eff2b7766be',
        width: 1200,
        height: 630,
        alt: 'Monkeys content and community platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monkeys | Posts, Events and Communities',
    description:
      'Discover thoughtful posts, explore topics, attend community events, and join groups built around shared interests.',
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
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Populates your environment at runtime rather than build time */}
        <PublicEnvScript />
      </head>
      <body
        className={`${dm_sans.variable} ${inter.variable} ${newsreader.variable} ${poppins.variable} ${playfair.variable} ${montserrat.variable} ${raleway.variable} ${robotoSlab.variable} ${jetbrainsMono.variable} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
      >
        <DonationPopup />
        <Toaster />
        <GrowthbookClientProvider>
          <QueryClientMount>
            <ThemeProviders>
              <TooltipProvider>
                {/* <Separator /> */}
                <main>
                  <AppShell>{children}</AppShell>
                </main>
                {/* <Separator /> */}
                <Footer />
              </TooltipProvider>
            </ThemeProviders>
          </QueryClientMount>
        </GrowthbookClientProvider>

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
      </body>
    </html>
  );
};

export default RootLayout;
