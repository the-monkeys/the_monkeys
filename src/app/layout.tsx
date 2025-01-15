import type { Metadata } from 'next';
import { Arvo, DM_Sans, IBM_Plex_Sans } from 'next/font/google';

import AdSense from '@/components/AdSense/AdSense';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { validate } from './actions/auth';
import './globals.css';
import { SessionStoreProvider } from './session-store-provider';
import SWRProvider from './swr-provider';
import { ThemeProviders } from './theme-provider';

const arvo = Arvo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-arvo',
  display: 'swap',
});

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
    'Join Monkeys for collaborative blog writing, blog version control, diverse topics and staying updated with ongoing global headlines.',
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: 'WIMiYru73CLiTFT9yEP2zIgQCv07AxBETTstbKe7Fws',
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const authData = await validate();

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <AdSense pId='4687427997504601' />
      </head>
      <body
        className={`${arvo.variable} ${dm_sans.variable} ${ibm_plex_sans.variable} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
      >
        <Toaster />
        <SWRProvider>
          <SessionStoreProvider value={authData}>
            <ThemeProviders>
              <TooltipProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </TooltipProvider>
            </ThemeProviders>
          </SessionStoreProvider>
        </SWRProvider>
      </body>
    </html>
  );
};

export default RootLayout;
