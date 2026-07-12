export interface ProfileImageCropState {
  offsetX: number;
  offsetY: number;
  zoom: number;
}

export interface ProfileImageCropOptions {
  file: File;
  frameSize: number;
  cropState: ProfileImageCropState;
}

const MAX_OUTPUT_SIZE = 1024;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('Failed to load the selected image.'));
    image.src = src;
  });

const blobToFile = (blob: Blob, fileName: string) =>
  new File([blob], fileName, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });

export const cropProfileImage = async ({
  file,
  frameSize,
  cropState,
}: ProfileImageCropOptions): Promise<File> => {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);
    const baseScale = Math.max(
      frameSize / image.naturalWidth,
      frameSize / image.naturalHeight
    );
    const scale = baseScale * cropState.zoom;
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;

    const maxOffsetX = Math.max(0, (renderedWidth - frameSize) / 2);
    const maxOffsetY = Math.max(0, (renderedHeight - frameSize) / 2);

    const offsetX = clamp(cropState.offsetX, -maxOffsetX, maxOffsetX);
    const offsetY = clamp(cropState.offsetY, -maxOffsetY, maxOffsetY);

    const sourceSize = Math.max(
      1,
      Math.min(
        image.naturalWidth,
        image.naturalHeight,
        Math.round(frameSize / scale)
      )
    );
    const sourceX = clamp(
      (frameSize / 2 - renderedWidth / 2 - offsetX) / scale,
      0,
      image.naturalWidth - sourceSize
    );
    const sourceY = clamp(
      (frameSize / 2 - renderedHeight / 2 - offsetY) / scale,
      0,
      image.naturalHeight - sourceSize
    );
    const outputSize = Math.min(MAX_OUTPUT_SIZE, sourceSize);

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to prepare the cropped image.');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, outputSize, outputSize);
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    );

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error('Failed to generate the cropped image.'));
            return;
          }

          resolve(result);
        },
        'image/jpeg',
        0.92
      );
    });

    if (blob.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        'The cropped image is still too large. Try a tighter crop.'
      );
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'profile-image';
    return blobToFile(blob, `${baseName}-cropped.jpg`);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};
