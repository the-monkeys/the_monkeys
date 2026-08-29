import { Metadata } from 'next';

import { API_URL, LIVE_URL } from '@/constants/api';
import { GroupResp } from '@/services/groups/groupsTypes';

import GroupDetailClient from './GroupDetailClient';

async function loadGroup(slug: string): Promise<GroupResp | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/groups/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await loadGroup(params.slug);
  const group = data?.group;
  if (!group) {
    return { title: 'Group not found' };
  }

  const base = LIVE_URL || 'https://monkeys.com.co';
  const title = group.name;
  const description = (group.description || '').slice(0, 160);
  const url = `${base}/groups/${group.slug}`;
  const imageUrl =
    group.cover_image ||
    group.logo_image ||
    `${base}/social-snapshot-placeholder.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Monkeys',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function GroupDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <GroupDetailClient slug={params.slug} />;
}
