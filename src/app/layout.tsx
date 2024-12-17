import type { Metadata } from 'next';
import { Arvo, DM_Sans, Lato, Roboto } from 'next/font/google';

import AdSense from '@/components/AdSense/AdSense';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';

import Providers from './Providers';
import './globals.css';
import SWRProvider from './swr-provider';
import { ThemeProviders } from './theme-provider';

const arvo = Arvo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-arvo',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const dm_sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm_sans',
  display: 'swap',
});

const lato = Lato({
  weight: ['100', '300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
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
        className={`${arvo.variable} ${roboto.variable} ${dm_sans.variable} ${lato.variable} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
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
