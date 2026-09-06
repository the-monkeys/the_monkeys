import { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import {
  breadcrumb,
  indexRobots,
  noIndexRobots,
  pageMetadata,
  truncateMeta,
} from '@/lib/seo';
import { groupJsonLd } from '@/lib/seoSchema';
import { GroupResp } from '@/services/groups/groupsTypes';

import GroupDetailClient from './GroupDetailClient';
import { loadGroupForMetadata } from './groupMetadata';

function isIndexable(group: NonNullable<GroupResp['group']>) {
  const published = !group.status || group.status === 'published';
  return group.visibility === 'public' && published;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await loadGroupForMetadata(params.slug);
  const group = data?.group;
  if (!group) {
    return { title: 'Group not found', robots: noIndexRobots };
  }

  if (!isIndexable(group)) {
    return { title: group.name, robots: noIndexRobots };
  }

  return {
    ...pageMetadata({
      title: group.name,
      description: truncateMeta(
        group.description ||
          `${group.name}. A research group on Monkeys. Join the community and follow its events.`
      ),
      path: `/groups/${group.slug}`,
      keywords: group.topics,
      image: group.cover_image || group.logo_image,
    }),
    robots: indexRobots,
  };
}

export default async function GroupDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await loadGroupForMetadata(params.slug);
  const group = data?.group;

  return (
    <>
      {group && isIndexable(group) && (
        <>
          <JsonLd data={groupJsonLd(group)} />
          <JsonLd
            data={breadcrumb([
              { name: 'Home', path: '/' },
              { name: 'Groups', path: '/groups' },
              { name: group.name, path: `/groups/${group.slug}` },
            ])}
          />
        </>
      )}
      <GroupDetailClient slug={params.slug} />
    </>
  );
}
