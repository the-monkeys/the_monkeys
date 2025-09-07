import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { API_URL, API_URL_V2 } from '@/constants/api';
import { baseUrl } from '@/constants/baseUrl';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';

import monkeyslogoImg from '../../../public/logo-brand.svg';

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
        title: `${username} | Monkeys`,
        description: `View ${username}'s profile on Monkeys`,
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const profileImageUrl = monkeyslogoImg;
    const fullName = `${userData.first_name} ${userData.last_name}`;
    const description =
      userData.bio ||
      `${fullName}'s profile on Monkeys. ${
        userData.topics?.length
          ? `Interests: ${userData.topics.join(', ')}.`
          : ''
      }`;
    const profileUrl = `${baseUrl}/@${username}`;
    const twitterHandle = userData.twitter
      ? userData.twitter.replace('https://twitter.com/', '').replace('@', '')
      : undefined;

    const metadata: Metadata = {
      title: `${fullName} (@${username}) | Monkeys`,
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
      title: `${username} | Monkeys`,
      description: `View ${username}'s profile on Monkeys`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

const ProfilePageLayout = ({ children, params }: ProfileLayoutProps) => {
  return (
    <Container className='px-4 py-6 min-h-[800px] space-y-10'>
      <article itemScope itemType='https://schema.org/Person'>
        <meta itemProp='name' content={`@${params.username}`} />
        {children}
      </article>
    </Container>
  );
};

export default ProfilePageLayout;
