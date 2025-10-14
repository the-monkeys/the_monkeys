import Script from 'next/script';

import { shouldLoadAdSense } from '@/utils/environment';

type AdSenseType = {
  pId: string;
};
const AdSense = ({ pId }: AdSenseType) => {
  // Don't render anything if AdSense should not be loaded
  if (!shouldLoadAdSense()) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin='anonymous'
      strategy='afterInteractive'
    />
  );
};

export default AdSense;
