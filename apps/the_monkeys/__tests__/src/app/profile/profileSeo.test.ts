import {
  buildProfileJsonLd,
  buildProfileMetadata,
} from '@/app/[username]/profileSeo';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { describe, expect, it } from 'vitest';

const profile: GetPublicUserProfileApiResponse = {
  username: 'ada',
  first_name: 'Ada',
  last_name: 'Lovelace',
  bio: 'Writer and researcher exploring computing and society.',
  address: 'London',
  twitter: 'https://x.com/ada',
  github: 'https://github.com/ada',
  linkedin: '',
  instagram: '',
  created_at: { seconds: 1, nanos: 0 },
  topics: ['Computing', 'Society'],
};

describe('public profile SEO', () => {
  it('builds canonical metadata from public profile fields', () => {
    const metadata = buildProfileMetadata(profile);

    expect(metadata.title).toEqual({
      absolute: 'Ada Lovelace (@ada) | Monkeys',
    });
    expect(metadata.alternates).toEqual({
      canonical: 'https://monkeys.com.co/ada',
    });
    expect(metadata.description).toBe(
      'Writer and researcher exploring computing and society.'
    );
  });

  it('builds a ProfilePage without private account fields or false employment', () => {
    const schema = buildProfileJsonLd(profile);
    const serialized = JSON.stringify(schema);

    expect(schema).toMatchObject({
      '@type': 'ProfilePage',
      url: 'https://monkeys.com.co/ada',
      mainEntity: {
        '@type': 'Person',
        name: 'Ada Lovelace',
        alternateName: '@ada',
      },
    });
    expect(serialized).not.toContain('contact_number');
    expect(serialized).not.toContain('worksFor');
    expect(serialized).not.toContain('homeLocation');
    expect(serialized).not.toContain('London');
    expect(serialized).toContain('https://x.com/ada');
  });
});
