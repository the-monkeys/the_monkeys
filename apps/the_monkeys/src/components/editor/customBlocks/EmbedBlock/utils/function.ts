type EmbedHandler = (wrapper: HTMLElement, url?: string) => void;

const loadScriptOnce = (src: string, onLoad: () => void): void => {
  if (document.querySelector(`script[src="${src}"]`)) {
    onLoad();
    return;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = onLoad;
  script.onerror = () =>
    console.error(`[Embed Error] Failed to load script: ${src}`);
  document.body.appendChild(script);
};

export const renderInstagramEmbed: EmbedHandler = (wrapper, url) => {
  if (!url) return console.warn('[InstagramEmbed] Invalid URL');

  const container = document.createElement('div');
  container.className = 'embed-center ig-wrapper';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'instagram-media';
  blockquote.setAttribute('data-instgrm-permalink', url);
  blockquote.setAttribute('data-instgrm-version', '14');

  container.appendChild(blockquote);
  wrapper.appendChild(container);

  const processEmbeds = () => (window as any).instgrm?.Embeds?.process();

  if ((window as any).instgrm?.Embeds?.process) {
    processEmbeds();
  } else {
    loadScriptOnce('https://www.instagram.com/embed.js', processEmbeds);
  }
};

export const renderTwitterEmbed: EmbedHandler = (wrapper, url) => {
  if (!url) return console.warn('[TwitterEmbed] Invalid URL');

  const normalizedUrl = url.replace('https://x.com', 'https://twitter.com');
  const container = document.createElement('div');
  container.className = 'embed-center twt-wrapper';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'twitter-tweet';
  blockquote.setAttribute('data-conversation', 'none');
  blockquote.setAttribute('data-theme', 'dark');
  blockquote.setAttribute('data-transparent', 'true');

  blockquote.innerHTML = `<a href="${normalizedUrl}"></a>`;

  container.appendChild(blockquote);
  wrapper.appendChild(container);

  const processEmbeds = () => (window as any).twttr?.widgets?.load(wrapper);

  if ((window as any).twttr?.widgets) {
    processEmbeds();
  } else {
    loadScriptOnce('https://platform.twitter.com/widgets.js', processEmbeds);
  }
};

export const renderYouTubeEmbed: EmbedHandler = (wrapper, url) => {
  if (!url) return console.warn('[YouTubeEmbed] Invalid URL');

  let videoId: string | null = null;
  try {
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop() || null;
    } else {
      videoId = new URL(url).searchParams.get('v');
    }
  } catch (err) {
    console.error('[YouTubeEmbed] Invalid YouTube URL:', err);
  }

  if (!videoId)
    return console.warn('[YouTubeEmbed] Unable to extract video ID');

  const container = document.createElement('div');
  container.className = 'embed-center yt-wrapper';

  const iframe = document.createElement('iframe');
  iframe.className = 'yt-iframe';
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.title = 'YouTube video player';
  iframe.loading = 'lazy';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
  );

  container.appendChild(iframe);
  wrapper.appendChild(container);
};

export const renderFacebookEmbed: EmbedHandler = (wrapper, url) => {
  if (!url) return console.warn('[FacebookEmbed] Invalid URL');

  if (!document.getElementById('fb-root')) {
    const fbRoot = document.createElement('div');
    fbRoot.id = 'fb-root';
    document.body.appendChild(fbRoot);
  }

  const container = document.createElement('div');
  container.className = ' fb-wrapper';

  const fbPost = document.createElement('div');
  fbPost.className = 'fb-post';
  fbPost.setAttribute('data-href', url);

  container.appendChild(fbPost);
  wrapper.appendChild(container);

  const parseFacebook = () => (window as any).FB?.XFBML?.parse(wrapper);

  if ((window as any).FB?.XFBML?.parse) {
    parseFacebook();
  } else {
    loadScriptOnce(
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0',
      parseFacebook
    );
  }
};

export const renderUnsupportedEmbed: EmbedHandler = (wrapper, url) => {
  if (!wrapper) return; // Safety check

  const container = document.createElement('a');

  if (typeof url === 'string' && url.trim().length > 0) {
    try {
      // Validate and normalize the URL
      const safeUrl = new URL(url, window.location.origin);
      container.href = safeUrl.toString();
      container.textContent = safeUrl.href;
      container.target = '_blank';
      container.rel = 'noopener noreferrer';
    } catch {
      // Fallback for invalid URLs
      container.textContent = 'Invalid link';
      container.removeAttribute('href');
    }
  } else {
    container.textContent = 'Invalid link';
  }

  // Use DocumentFragment to minimize reflow/repaint cost
  const fragment = document.createDocumentFragment();
  fragment.appendChild(container);
  wrapper.textContent = ''; // Clear previous content safely
  wrapper.appendChild(fragment);
};
