export function fitPreviewScale(
  nativeWidth: number,
  nativeHeight: number,
  availableWidth: number
): { scale: number; scaledWidth: number; scaledHeight: number } {
  if (nativeWidth <= 0 || availableWidth <= 0) {
    return { scale: 0, scaledWidth: 0, scaledHeight: 0 };
  }
  const scale = Math.min(1, availableWidth / nativeWidth);
  return {
    scale,
    scaledWidth: nativeWidth * scale,
    scaledHeight: nativeHeight * scale,
  };
}
