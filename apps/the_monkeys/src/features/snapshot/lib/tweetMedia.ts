import {
  TweetSyndication,
  TweetSyndicationMedia,
  TweetSyndicationVideoVariant,
} from '../types/tweetSyndication';

export const collectTweetMedia = (
  tweet: TweetSyndication
): TweetSyndicationMedia[] => {
  const fromDetails = tweet.mediaDetails ?? [];
  const fromPhotos = tweet.photos ?? [];
  const fromEntities = tweet.entities?.media ?? [];
  const seen = new Set<string>();
  const out: TweetSyndicationMedia[] = [];

  for (const media of [...fromDetails, ...fromPhotos, ...fromEntities]) {
    const url = media.media_url_https;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(media);
  }

  return out.slice(0, 4);
};

export const isTweetVideoMedia = (
  media?: TweetSyndicationMedia | null
): media is TweetSyndicationMedia =>
  media?.type === 'video' || media?.type === 'animated_gif';

export const getTweetMediaAspectRatio = (
  media?: TweetSyndicationMedia | null
) => {
  const [width, height] = media?.video_info?.aspect_ratio ?? [];
  if (!width || !height) return null;
  return width / height;
};

export const getTweetImageAspectRatio = (
  media?: TweetSyndicationMedia | null
) => {
  const width = media?.sizes?.large?.w;
  const height = media?.sizes?.large?.h;
  if (!width || !height) return null;
  return width / height;
};

export const getBestTweetVideoVariant = (
  media?: TweetSyndicationMedia | null
): TweetSyndicationVideoVariant | null => {
  if (!isTweetVideoMedia(media)) return null;

  return (
    media.video_info?.variants
      ?.filter(
        (variant) =>
          variant.content_type === 'video/mp4' || variant.url.includes('.mp4')
      )
      .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0] ?? null
  );
};

export const getTweetDownloadVideoVariant = (
  tweet?: TweetSyndication | null
) => {
  if (!tweet) return null;

  for (const media of collectTweetMedia(tweet)) {
    const variant = getBestTweetVideoVariant(media);
    if (variant) return variant;
  }

  return null;
};
