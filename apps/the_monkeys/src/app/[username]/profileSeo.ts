import type { Metadata } from 'next';

import {
  MONKEYS_WEBSITE_ID,
  OG_IMAGE,
  absoluteUrl,
  normalizeSeoText,
  pageMetadata,
} from '@/lib/seo';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';

function profileName(profile: GetPublicUserProfileApiResponse): string {
  return (
    [profile.first_name, profile.last_name].filter(Boolean).join(' ') ||
    profile.username
  );
}

function publicSocialUrls(profile: GetPublicUserProfileApiResponse): string[] {
  return [profile.twitter, profile.github, profile.linkedin, profile.instagram]
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => /^https:\/\//i.test(value));
}

export function buildProfileMetadata(
  profile: GetPublicUserProfileApiResponse
): Metadata {
  const name = profileName(profile);
  const description =
    normalizeSeoText(profile.bio, 160) ||
    `Read posts and explore the public profile of ${name} on Monkeys.`;
  return pageMetadata({
    title: `${name} (@${profile.username}) | Monkeys`,
    description,
    path: `/${profile.username}`,
    keywords: profile.topics,
    image: OG_IMAGE,
  });
}

export function buildProfileJsonLd(profile: GetPublicUserProfileApiResponse) {
  const name = profileName(profile);
  const url = absoluteUrl(`/${profile.username}`);
  const sameAs = publicSocialUrls(profile);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    name: `${name} (@${profile.username})`,
    isPartOf: { '@id': MONKEYS_WEBSITE_ID },
    mainEntity: {
      '@type': 'Person',
      '@id': `${url}#person`,
      name,
      alternateName: `@${profile.username}`,
      url,
      description: normalizeSeoText(profile.bio, 500) || undefined,
      knowsAbout: profile.topics?.length ? profile.topics : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
    },
  };
}
