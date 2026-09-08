import type { Metadata } from 'next';

import { LIVE_URL } from '@/constants/api';
import { baseUrl } from '@/constants/baseUrl';

export const SITE_URL = (LIVE_URL || baseUrl).replace(/\/$/, '');
export const SITE_NAME = 'Monkeys';
export const OG_IMAGE = `${SITE_URL}/opengraph-image.png?b7ef6eff2b7766be`;
export const TWITTER_SITE = '@monkeys_com_co';

export const indexRobots: Metadata['robots'] = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

export const noIndexRobots: Metadata['robots'] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export const noIndexMetadata: Metadata = {
  robots: noIndexRobots,
};

export function noIndexPage(title: string): Metadata {
  return {
    title: { absolute: title },
    robots: noIndexRobots,
  };
}

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncateMeta(text: string, max = 160): string {
  const trimmed = (text || '').replace(/\s+/g, ' ').trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image = OG_IMAGE,
  type = 'website',
  rss,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  rss?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || OG_IMAGE);
  return {
    title: {
      absolute: title,
    },
    description,
    keywords,
    alternates: {
      canonical: url,
      ...(rss ? { types: { 'application/rss+xml': absoluteUrl(rss) } } : {}),
    },
    robots: indexRobots,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      site: TWITTER_SITE,
    },
  };
}

export function publisherOrg() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: OG_IMAGE,
      width: 1200,
      height: 630,
    },
    sameAs: [
      'https://x.com/monkeys_com_co',
      'https://www.instagram.com/monkeys_com_co',
    ],
  };
}

export function faqPage(
  url: string,
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const EVENTS_SEO = {
  path: '/events',
  title: 'Research Events & Meetups | Host or RSVP Talks, Workshops & Sessions',
  description:
    'Discover and host research meetups, academic talks, workshops, and community events on Monkeys. Free or paid RSVP, in-person or virtual. Built for writers, researchers, and local groups.',
  keywords: [
    'research events',
    'academic meetups',
    'host a meetup',
    'RSVP events',
    'virtual workshops',
    'community events',
    'research talks',
    'Meetup alternative',
    'Monkeys events',
  ],
  faqs: [
    {
      question: 'Can I host a research meetup or talk on Monkeys?',
      answer:
        'Yes. Create a free or paid event, one-off or recurring, with RSVP, tickets, and a public page at monkeys.com.co/events.',
    },
    {
      question: 'Are Monkeys events free to attend?',
      answer:
        'Hosts can offer free RSVP or paid tickets. Discovery of public events is free. Virtual, in-person, and hybrid events are supported.',
    },
    {
      question: 'How is Monkeys different from Meetup?',
      answer:
        'Monkeys is a research-first publishing platform. Events and groups sit next to research journals, so communities can publish, meet, and share from one place.',
    },
  ],
};

export const GROUPS_SEO = {
  path: '/groups',
  title: 'Research Groups & Communities | Join or Start a Group on Monkeys',
  description:
    'Find research groups, writing circles, and local communities on Monkeys. Start a public group, host events, and grow a community around your field.',
  keywords: [
    'research groups',
    'academic community',
    'writing groups',
    'start a group',
    'join a community',
    'Meetup groups alternative',
    'Monkeys groups',
  ],
  faqs: [
    {
      question: 'How do I start a research group on Monkeys?',
      answer:
        'Open Groups, tap Start a group, and publish a public community. You can then host events, invite members, and share a public group page.',
    },
    {
      question: 'Are Monkeys groups public?',
      answer:
        'Groups can be public, private, or unlisted. Only public published groups are listed in search and on the Groups directory.',
    },
  ],
};

export const STUDIO_SEO = {
  path: '/snapshot/new',
  title:
    'Free Social Image Studio | Instagram Templates & X Screenshot Generator',
  description:
    'Create share-ready Instagram portraits, quote cards, carousels, and clean X (Twitter) screenshots in Monkeys Studio. Free tools for researchers and writers. No design software needed.',
  keywords: [
    'instagram post template',
    'twitter screenshot generator',
    'X screenshot maker',
    'quote card maker',
    'research social images',
    'free social media templates',
    'Monkeys studio',
  ],
  faqs: [
    {
      question: 'Is the Monkeys image studio free?',
      answer:
        'Yes. Image templates and the X screenshot generator are free to use in the browser at monkeys.com.co/snapshot/new. Digital business cards are free with a Monkeys account.',
    },
    {
      question:
        'Do I need an account to make Instagram templates or tweet screenshots?',
      answer:
        'No. Anyone can open Studio and download PNG or JPEG images. Signing in adds your name and photo to the template byline.',
    },
  ],
};

export const X_SCREENSHOT_SEO = {
  path: '/snapshot/new?view=x',
  title: 'X / Twitter Screenshot Generator | Clean Tweet Cards (Free)',
  description:
    'Paste a public X (Twitter) post URL and download a clean screenshot card. Square, story, and share sizes with watermark controls. Free in Monkeys Studio.',
  keywords: [
    'twitter screenshot generator',
    'X screenshot',
    'tweet screenshot maker',
    'download tweet image',
    'clean twitter screenshot',
  ],
};

export const CARDS_SEO = {
  path: '/cards',
  title: 'Digital Business Card Maker | QR vCard, PNG & Shareable Card',
  description:
    'Design a digital business card with QR code, contact details, and social links. Download PNG, JPEG, or vCard. Free on Monkeys Studio.',
  keywords: [
    'digital business card',
    'vCard QR code',
    'online visiting card',
    'NFC business card alternative',
    'free business card maker',
  ],
  faqs: [
    {
      question: 'Can I download a vCard from my Monkeys business card?',
      answer:
        'Yes. The card studio exports PNG, JPEG, and a vCard file so people can scan a QR code and save your contact.',
    },
  ],
};
