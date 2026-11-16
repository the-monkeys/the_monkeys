'use client';

import { useEffect, useRef } from 'react';

import '../customBlocks/EmbedBlock/style.css';
import {
  renderFacebookEmbed,
  renderInstagramEmbed,
  renderTwitterEmbed,
} from '../customBlocks/EmbedBlock/utils/embed-function';
import { readerHtml, readerUrl, text } from './readerHtml';

export function ReaderEmbed({ data }: { data: Record<string, unknown> }) {
  const host = useRef<HTMLDivElement>(null);
  const url = readerUrl(data.url || data.source || data.embed);
  let service = '';
  let videoId = '';
  if (url) {
    const parsed = new URL(url, 'https://reader.invalid');
    const hostname = parsed.hostname.replace(/^(www\.|m\.|mobile\.)/, '');
    if (hostname === 'youtu.be' || hostname === 'youtube.com') {
      service = 'youtube';
      const candidate =
        hostname === 'youtu.be'
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get('v') ||
            parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ||
            '';
      if (/^[\w-]{11}$/.test(candidate)) videoId = candidate;
    } else if (['twitter.com', 'x.com'].includes(hostname)) service = 'twitter';
    else if (hostname === 'instagram.com') service = 'instagram';
    else if (hostname === 'facebook.com') service = 'facebook';
  }

  useEffect(() => {
    if (!host.current || !url) return;
    const render = {
      twitter: renderTwitterEmbed,
      instagram: renderInstagramEmbed,
      facebook: renderFacebookEmbed,
    }[service];
    if (!render) return;
    // An isolated imperative host for the existing social widgets. The source
    // link stays available if their third-party script is blocked or fails.
    const element = host.current;
    render(element, new URL(url, window.location.origin).href);
    return () => element.replaceChildren();
  }, [url, service]);

  if (!url) return null;
  return (
    <figure>
      {videoId ? (
        <div className='embed-center yt-wrapper'>
          <iframe
            className='yt-iframe'
            src={`https://www.youtube.com/embed/${videoId}`}
            title='YouTube video player'
            loading='lazy'
            allowFullScreen
            referrerPolicy='strict-origin-when-cross-origin'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          />
        </div>
      ) : (
        <>
          <div ref={host} />
          <a href={url} target='_blank' rel='noopener noreferrer'>
            {text(data.ogTitle) || url}
          </a>
        </>
      )}
      {data.caption ? (
        <figcaption
          dangerouslySetInnerHTML={{ __html: readerHtml(data.caption) }}
        />
      ) : null}
    </figure>
  );
}
