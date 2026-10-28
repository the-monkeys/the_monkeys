import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import Container from '@/components/layout/Container';
import { noIndexFollowRobots } from '@/lib/seo';

import { loadPublicProfile } from './profileData';
import { buildProfileJsonLd, buildProfileMetadata } from './profileSeo';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { username: string };
}

function cleanUsername(raw: string): string {
  try {
    return decodeURIComponent(raw).replace(/^@+/, '');
  } catch {
    return raw.replace(/^@+/, '');
  }
}

export async function generateMetadata({
  params,
}: ProfileLayoutProps): Promise<Metadata> {
  const username = cleanUsername(params.username);
  const profile = await loadPublicProfile(username);
  if (profile === null) {
    return {
      title: { absolute: `@${username} | Monkeys` },
      description: `View @${username} on Monkeys.`,
      robots: noIndexFollowRobots,
    };
  }
  if (profile === undefined) {
    return {
      title: { absolute: 'Profile temporarily unavailable | Monkeys' },
      description: 'This Monkeys profile is temporarily unavailable.',
      robots: noIndexFollowRobots,
    };
  }
  return buildProfileMetadata(profile);
}

export default async function ProfilePageLayout({
  children,
  params,
}: ProfileLayoutProps) {
  let decoded = params.username;
  try {
    decoded = decodeURIComponent(params.username);
  } catch {
    decoded = params.username;
  }

  if (decoded.startsWith('@')) {
    redirect(`/${cleanUsername(params.username)}`);
  }

  const username = cleanUsername(params.username);
  const profile = await loadPublicProfile(username);
  if (profile === null) notFound();
  const jsonLd = profile ? buildProfileJsonLd(profile) : null;

  return (
    <Container className='px-4 py-6 min-h-[800px] space-y-10'>
      <article itemScope itemType='https://schema.org/ProfilePage'>
        <h1 className='text-2xl hidden font-bold'>{`Profile of @${username}`}</h1>
        <meta itemProp='name' content={`@${username}`} />
        {children}
      </article>

      {jsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </Container>
  );
}
