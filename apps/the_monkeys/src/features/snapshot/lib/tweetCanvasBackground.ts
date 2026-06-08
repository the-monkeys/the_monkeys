import { CSSProperties } from 'react';

import { TweetScreenshotOptions } from '../types/tweetScreenshotOptions';

export const getTweetCanvasBackground = (
  options: Pick<TweetScreenshotOptions, 'backgroundColor' | 'backgroundImage'>
): CSSProperties => {
  if (options.backgroundImage) {
    return {
      backgroundColor: options.backgroundColor,
      backgroundImage: options.backgroundImage,
    };
  }
  const bg = options.backgroundColor;
  return {
    background: `linear-gradient(165deg, ${bg} 0%, ${bg} 42%, ${bg}dd 72%, ${bg}99 100%)`,
    backgroundColor: bg,
  };
};
