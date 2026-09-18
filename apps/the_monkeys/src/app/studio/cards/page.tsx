import { JsonLd } from '@/components/seo/JsonLd';
import { CARDS_SEO } from '@/lib/seo';
import { studioHubGraph } from '@/lib/seoSchema';

import CardsPageClient from './CardsPageClient';

export default function CardsPage() {
  return (
    <>
      <JsonLd
        data={studioHubGraph({
          path: CARDS_SEO.path,
          name: CARDS_SEO.title,
          description: CARDS_SEO.description,
          faqs: CARDS_SEO.faqs,
          featureList: [
            'Digital business card templates',
            'QR code to save contact',
            'Download PNG, JPEG, or vCard',
            'Photo, logo, and social links',
          ],
        })}
      />
      <h1 className='hidden text-2xl font-bold'>{CARDS_SEO.title}</h1>
      <CardsPageClient />
    </>
  );
}
