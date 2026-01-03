import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { API_URL, LIVE_URL } from '@/constants/api';
import { baseUrl } from '@/constants/baseUrl';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { username: string };
}

const fetchUserData = async (
  username: string
): Promise<GetPublicUserProfileApiResponse | null> => {
  try {
    const res = await fetch(`${API_URL}/user/public/${username}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(
        `User fetch failed for ID ${username} with status ${res.status}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch user data for ID: ${username}`, error);
    return null;
  }
};

const truncateDescription = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength
    ? `${text.substring(0, maxLength - 3)}...`
    : text;
};

export async function generateMetadata({
  params,
}: ProfileLayoutProps): Promise<Metadata> {
  const username = params.username;

  try {
    const userData = await fetchUserData(username);
    if (!userData) {
      return {
        title: `${username} `,
        description: `View ${username}'s profile on Monkeys`,
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const profileImageUrl = `${LIVE_URL}/opengraph-image.png?b7ef6eff2b7766be`;
    const fullName = `${userData.first_name} ${userData.last_name ?? ''}`;
    const description =
      userData.bio ||
      `${fullName}'s profile on Monkeys. ${
        userData.topics?.length
          ? `Interests: ${userData.topics.join(', ')}.`
          : ''
      }`;
    const profileUrl = `${baseUrl}/${username}`;
    const twitterHandle = userData.twitter
      ? userData.twitter.replace('https://twitter.com/', '').replace('@', '')
      : undefined;

    const metadata: Metadata = {
      title: {
        default: `${fullName} (@${username}) | Monkeys`,
        template: `%s | Monkeys`,
      },
      description: truncateDescription(description, 160),
      keywords: userData.topics?.join(', ') || '',
      alternates: {
        canonical: profileUrl,
      },
      openGraph: {
        title: `${fullName} (@${username})`,
        description: truncateDescription(description, 160),
        url: profileUrl,
        type: 'profile',
        images: [
          {
            url: profileImageUrl,
            width: 1200,
            height: 630,
            alt: `${fullName}'s profile picture`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${fullName} (@${username})`,
        description: truncateDescription(description, 160),
        images: [profileImageUrl],
        creator: twitterHandle ? `@${twitterHandle}` : undefined,
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
        },
      },
      metadataBase: new URL(baseUrl),
    };

    return metadata;
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: {
        default: `${username} | Monkeys`,
        template: `%s | Monkeys`,
      },
      description: `View ${username}'s profile on Monkeys`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

const ProfilePageLayout = ({ children, params }: ProfileLayoutProps) => {
  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: params.username,
    alternateName: `@${params.username}`,
    url: `${baseUrl}/${params.username}`,
    worksFor: {
      '@type': 'Organization',
      name: 'Monkeys',
    },
  };

  return (
    <Container className='px-4 py-6 min-h-[800px] space-y-10'>
      <article itemScope itemType='https://schema.org/Person'>
        {/* H1 for SEO */}
        <h1 className='text-2xl hidden font-bold'>
          Profile of @{params.username}
        </h1>

        <meta itemProp='name' content={`@${params.username}`} />
        {children}
      </article>

      {/* JSON-LD schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }}
      />
    </Container>
  );
};

export default ProfilePageLayout;
