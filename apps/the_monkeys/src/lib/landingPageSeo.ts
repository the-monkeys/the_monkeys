import type { Metadata } from 'next';

import {
  MONKEYS_WEBSITE_ID,
  OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  indexRobots,
  monkeysBrand,
  monkeysWebsite,
  publisherOrg,
} from '@/lib/seo';

const title = 'Monkeys | Posts, Events and Communities';
const description =
  'Discover thoughtful posts, join interest-based groups, and attend meaningful events on an independent content and community platform.';

export const landingMetadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'content community platform',
    'thoughtful posts',
    'community events',
    'interest based groups',
    'creator community',
  ],
  alternates: { canonical: absoluteUrl('/') },
  robots: indexRobots,
  openGraph: {
    title,
    description,
    url: absoluteUrl('/'),
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [OG_IMAGE],
    site: '@monkeys_com_co',
  },
};

export const landingCollectionSchema = {
  '@type': 'CollectionPage',
  '@id': `${absoluteUrl('/')}#collection`,
  name: title,
  url: absoluteUrl('/'),
  description,
  isPartOf: {
    '@id': MONKEYS_WEBSITE_ID,
  },
  about: [
    { '@type': 'Thing', name: 'Thoughtful posts' },
    { '@type': 'Thing', name: 'Community events' },
    { '@type': 'Thing', name: 'Interest-based groups' },
    { '@type': 'Thing', name: 'Community discovery' },
  ],
  hasPart: [
    { '@type': 'SiteNavigationElement', name: 'Posts', url: absoluteUrl('/') },
    {
      '@type': 'SiteNavigationElement',
      name: 'Events',
      url: absoluteUrl('/events'),
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Groups',
      url: absoluteUrl('/groups'),
    },
    {
      '@type': 'SiteNavigationElement',
      name: 'Topics',
      url: absoluteUrl('/topics/explore'),
    },
  ],
};

export const landingEntityGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    publisherOrg(),
    monkeysBrand(),
    monkeysWebsite(),
    landingCollectionSchema,
  ],
};
