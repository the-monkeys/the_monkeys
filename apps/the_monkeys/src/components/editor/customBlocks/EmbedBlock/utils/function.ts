export const Instagram = (wrapper: HTMLElement, URL: string): void => {
  const container = document.createElement('div');
  container.className = 'center';
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'instagram-media center';
  blockquote.setAttribute('data-instgrm-permalink', URL);
  blockquote.setAttribute('data-instgrm-version', '14');
  container.appendChild(blockquote);
  wrapper.appendChild(container);

  if ((window as any).instgrm?.Embeds?.process) {
    (window as any).instgrm.Embeds.process();
    return;
  } else {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      (window as any).instgrm?.Embeds?.process();
    };
    wrapper.appendChild(script);
    return;
  }
};

export const Twitter = (wrapper: HTMLElement, URL: string): void => {
  const tweetUrl = URL.replace('https://x.com', 'https://twitter.com');

  // Create a container for styling
  const container = document.createElement('div');
  container.className = 'twitter-embed-container center';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'twitter-tweet';

  blockquote.setAttribute('data-conversation', 'none');
  // blockquote.setAttribute('data-cards', 'hidden');      // Hides image/media card
  blockquote.setAttribute('data-theme', 'dark');

  blockquote.innerHTML = `<a href="${tweetUrl}"></a>`;

  container.appendChild(blockquote);
  wrapper.appendChild(container);

  if ((window as any).twttr?.widgets) {
    (window as any).twttr.widgets.load(wrapper);
  } else {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = () => {
      (window as any).twttr?.widgets?.load(wrapper);
    };
    document.body.appendChild(script);
  }
  return;
};

export const Youtube = (wrapper: HTMLElement, url: string): void => {
  const videoId = url.includes('youtu.be')
    ? url.split('/').pop()
    : new URL(url).searchParams.get('v');
  if (videoId) {
    const container = document.createElement('div');
    container.className = 'center';
    const iframe = document.createElement('iframe');
    container.appendChild(iframe);
    iframe.width = '560';
    iframe.height = '315';
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.allowFullscreen = false;
    wrapper.appendChild(container);
    return;
  }
};

export const Facebook = (wrapper: HTMLElement, url: string): void => {
  if (!document.getElementById('fb-root')) {
    const fbRoot = document.createElement('div');
    fbRoot.id = 'fb-root';
    document.body.appendChild(fbRoot);
  }
  const container = document.createElement('div');
  container.className = 'center';
  const fbDiv = document.createElement('div');
  fbDiv.className = 'fb-post';
  fbDiv.setAttribute('data-href', url);
  fbDiv.setAttribute('data-width', '400');
  fbDiv.setAttribute('data-height', '200');
  container.appendChild(fbDiv);
  wrapper.appendChild(container);

  if ((window as any).FB?.XFBML?.parse) {
    (window as any).FB.XFBML.parse(wrapper);
  } else {
    const script = document.createElement('script');
    script.src =
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      (window as any).FB?.XFBML?.parse(wrapper);
    };
    wrapper.appendChild(script);
  }
  return;
};
