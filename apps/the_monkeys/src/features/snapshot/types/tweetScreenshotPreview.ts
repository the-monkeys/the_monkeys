export type MediaFrameRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TweetScreenshotPreviewHandle = {
  getExportRoot: () => HTMLDivElement | null;
  getMediaFrame: () => MediaFrameRect | null;
};
