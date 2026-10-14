import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import { STUDIO_SEO, X_SCREENSHOT_SEO, pageMetadata } from '@/lib/seo';
import { studioHubGraph } from '@/lib/seoSchema';

import SnapshotNewClient from './SnapshotNewClient';

type Props = {
  searchParams: { view?: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  if (searchParams.view === 'x') {
    return pageMetadata(X_SCREENSHOT_SEO);
  }
  return pageMetadata(STUDIO_SEO);
}

export default function SnapshotNewPage({ searchParams }: Props) {
  const isX = searchParams.view === 'x';
  const copy = isX ? X_SCREENSHOT_SEO : STUDIO_SEO;

  return (
    <>
      <JsonLd
        data={studioHubGraph({
          path: copy.path,
          name: copy.title,
          description: copy.description,
          faqs: STUDIO_SEO.faqs,
          featureList: isX
            ? [
                'Paste a public X post URL',
                'Clean tweet screenshot cards',
                'Square, story, and share sizes',
                'Optional branded video overlay',
              ]
            : [
                'Instagram editorial portraits',
                'Quote cards and thread covers',
                'Carousel and story templates',
                'Download PNG or JPEG',
              ],
        })}
      />
      <h1 className='hidden text-2xl font-bold'>{copy.title}</h1>
      <SnapshotNewClient />
    </>
  );
}
