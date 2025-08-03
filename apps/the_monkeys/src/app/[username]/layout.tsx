import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { API_URL_V2 } from '@/constants/api';
import { baseUrl } from '@/constants/baseUrl';

interface ProfileLayoutProps {
  children: React.ReactNode;
  params: { username: string };
}

export async function generateMetadata({
  params,
}: ProfileLayoutProps): Promise<Metadata> {
  const username = params.username;

  try {
    const userRes = await fetch(`${API_URL_V2}/user/public/${username}`);
    if (!userRes.ok) throw new Error('User not found');
    const userData = await userRes.json();

    let profileImageUrl = `${baseUrl}/default-profile.jpg`;
    try {
      const imageRes = await fetch(
        `${API_URL_V2}/files/profile/${username}/profile`
      );
      if (imageRes.ok) {
        profileImageUrl = `${API_URL_V2}/files/profile/${username}/profile`;
      }
    } catch (error) {
      console.error('Failed to fetch profile image:', error);
    }

    const fullName = `${userData.first_name} ${userData.last_name}`;
    const description =
      userData.bio ||
      `${fullName}'s profile on our platform. ${userData.topics?.length ? `Interests: ${userData.topics.join(', ')}.` : ''}`;
    const profileUrl = `${baseUrl}/@${username}`;

    return {
      title: `${fullName} (@${username}) | YourSiteName`,
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
        // profile: {
        //   firstName: userData.first_name,
        //   lastName: userData.last_name,
        //   username: username,
        // },
      },
      twitter: {
        card: 'summary_large_image',
        title: `${fullName} (@${username})`,
        description: truncateDescription(description, 160),
        images: profileImageUrl,
        creator: userData.twitter
          ? `@${userData.twitter.replace('https://twitter.com/', '')}`
          : undefined,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Failed to fetch user data for metadata:', error);
    return {
      title: `@${username} | YourSiteName`,
      description: `View ${username}'s profile`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

const truncateDescription = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength
    ? `${text.substring(0, maxLength - 3)}...`
    : text;
};

const ProfilePageLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <Container className='px-4 py-6 min-h-[800px] space-y-10'>
      <article itemScope itemType='https://schema.org/Person'>
        {children}
      </article>
    </Container>
  );
};

export default ProfilePageLayout;
