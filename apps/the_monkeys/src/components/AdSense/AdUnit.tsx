'use client';

import { useEffect, useRef } from 'react';

import Script from 'next/script';

type Props = {
  slot: string;
};

export default function AdUnit({ slot }: Props) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      // Only push once per ad element

      if (adRef.current && !adRef.current.dataset.adLoaded) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adRef.current.dataset.adLoaded = 'true';
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <>
      <Script
        id='adsbygoogle-lib'
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4687427997504601'
        strategy='afterInteractive'
        async
        crossOrigin='anonymous'
      />

      <ins
        ref={adRef as any}
        className='adsbygoogle'
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout='in-article'
        data-ad-format='fluid'
        data-ad-client='ca-pub-4687427997504601'
        data-ad-slot={slot}
        data-full-width-responsive='true'
      />
    </>
  );
}
