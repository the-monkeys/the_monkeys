'use client';

import { useEffect } from 'react';

import Script from 'next/script';

type Props = {
  slot: string;
};

export default function AdUnit({ slot }: Props) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
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
        className='adsbygoogle'
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout='in-article'
        data-ad-format='fluid'
        data-ad-client='ca-pub-4687427997504601'
        data-ad-slot={slot}
      />
    </>
  );
}
