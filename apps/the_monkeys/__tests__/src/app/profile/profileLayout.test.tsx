import ProfilePageLayout, { generateMetadata } from '@/app/[username]/layout';
import { loadPublicProfile } from '@/app/[username]/profileData';
import { USER_QUERY_KEY } from '@/hooks/user/useUser';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/app/[username]/profileData', () => ({ loadPublicProfile: vi.fn() }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

let queryClient: QueryClient;
vi.mock('@/utils/get-query-client', () => ({
  getQueryClient: () => queryClient,
}));

const profile: GetPublicUserProfileApiResponse = {
  username: 'ada',
  first_name: 'Ada',
  last_name: 'Lovelace',
  bio: 'Computing and society.',
  address: '',
  twitter: '',
  github: '',
  linkedin: '',
  instagram: '',
  created_at: { seconds: 1, nanos: 0 },
  topics: ['Computing'],
  is_verified: true,
};

async function renderProfile(username = 'ada') {
  const layout = await ProfilePageLayout({
    children: <div data-testid='profile-content'>Existing profile content</div>,
    params: { username },
  });
  const html = renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>{layout}</QueryClientProvider>
  );
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('profile layout structured data and compatibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient();
    vi.mocked(loadPublicProfile).mockResolvedValue(profile);
  });

  it('renders exactly one complete ProfilePage and preserves the existing layout', async () => {
    const document = await renderProfile();
    const schemas = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    ).map((script) => JSON.parse(script.textContent!));
    expect(
      schemas.filter((schema) => schema['@type'] === 'ProfilePage')
    ).toHaveLength(1);
    expect(schemas[0]).toMatchObject({
      '@type': 'ProfilePage',
      '@id': 'https://monkeys.com.co/ada#profile',
      url: 'https://monkeys.com.co/ada',
      mainEntity: {
        '@type': 'Person',
        name: 'Ada Lovelace',
        alternateName: '@ada',
        url: 'https://monkeys.com.co/ada',
      },
    });
    expect(
      document.querySelector(
        '[itemscope][itemtype="https://schema.org/ProfilePage"]'
      )
    ).toBeNull();
    expect(document.querySelector('meta[itemprop="name"]')).toBeNull();
    expect(document.querySelector('article > h1')?.className).toBe(
      'text-2xl hidden font-bold'
    );
    expect(document.querySelector('article > h1')?.textContent).toBe(
      'Profile of @ada'
    );
    expect(
      document.querySelector('article > [data-testid="profile-content"]')
        ?.textContent
    ).toBe('Existing profile content');
    expect(document.querySelector('body > div')?.className).toBe(
      'mx-auto max-w-[1400px] px-4 py-6 min-h-[800px] space-y-10'
    );
    expect(queryClient.getQueryData([USER_QUERY_KEY, 'ada'])).toEqual(profile);
  });

  it('keeps missing or deleted profiles as not found with no profile schema', async () => {
    vi.mocked(loadPublicProfile).mockResolvedValue(null);
    await expect(renderProfile('missing')).rejects.toThrow('NEXT_NOT_FOUND');
    expect(
      (
        await generateMetadata({
          children: null,
          params: { username: 'missing' },
        })
      ).robots
    ).toMatchObject({ index: false, follow: true });
  });

  it('keeps unavailable profiles noindex without emitting an incomplete ProfilePage', async () => {
    vi.mocked(loadPublicProfile).mockResolvedValue(undefined);
    const document = await renderProfile();
    expect(
      document.querySelector('script[type="application/ld+json"]')
    ).toBeNull();
    expect(
      document.querySelector(
        '[itemscope][itemtype="https://schema.org/ProfilePage"]'
      )
    ).toBeNull();
    expect(
      document.querySelector('[data-testid="profile-content"]')
    ).not.toBeNull();
    expect(
      (await generateMetadata({ children: null, params: { username: 'ada' } }))
        .robots
    ).toMatchObject({ index: false, follow: true });
  });

  it('preserves encoded @-profile redirects before fetching any profile', async () => {
    await expect(renderProfile('%40ada')).rejects.toThrow('NEXT_REDIRECT:/ada');
    expect(loadPublicProfile).not.toHaveBeenCalled();
  });

  it('keeps author text escaped inside the server-rendered JSON-LD', async () => {
    vi.mocked(loadPublicProfile).mockResolvedValue({
      ...profile,
      first_name: '</script><script>alert(1)</script>',
    });
    const document = await renderProfile();
    expect(document.querySelectorAll('script')).toHaveLength(1);
    expect(
      JSON.parse(document.querySelector('script')!.textContent!).mainEntity.name
    ).toBe('</script><script>alert(1)</script> Lovelace');
  });
});
