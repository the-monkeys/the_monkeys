import Script from 'next/script';

type AdSenseType = {
  pId: string;
};
const AdSense = ({ pId }: AdSenseType) => {
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
