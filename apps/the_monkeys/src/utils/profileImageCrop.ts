import type { Crop } from 'react-image-crop';

export interface ProfileImageCropState {
  crop: Crop;
}

export interface ProfileImageCropOptions {
  file: File;
  imageDimensions: { width: number; height: number } | null;
  crop: Crop;
  displayedSize?: { width: number; height: number };
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

export const getCropSourceCoordinates = ({
  imageDimensions,
  crop,
  frameSize,
  displayedSize,
}: {
  imageDimensions: { width: number; height: number };
  crop: Crop;
  frameSize: number;
  displayedSize?: { width: number; height: number };
}) => {
  const displayWidth = Math.max(
    1,
    displayedSize?.width ?? imageDimensions.width
  );
  const displayHeight = Math.max(
    1,
    displayedSize?.height ?? imageDimensions.height
  );

  const cropX = crop.unit === '%' ? (crop.x / 100) * displayWidth : crop.x;
  const cropY = crop.unit === '%' ? (crop.y / 100) * displayHeight : crop.y;
  const cropWidth =
    crop.unit === '%' ? (crop.width / 100) * displayWidth : crop.width;
  const cropHeight =
    crop.unit === '%' ? (crop.height / 100) * displayHeight : crop.height;

  const sourceX = Math.round(cropX * (imageDimensions.width / displayWidth));
  const sourceY = Math.round(cropY * (imageDimensions.height / displayHeight));
  const sourceWidth = Math.max(
    1,
    Math.round(cropWidth * (imageDimensions.width / displayWidth))
  );
  const sourceHeight = Math.max(
    1,
    Math.round(cropHeight * (imageDimensions.height / displayHeight))
  );
  const outputSize = Math.min(
    MAX_OUTPUT_SIZE,
    Math.round(Math.max(sourceWidth, sourceHeight))
  );

  return {
    sourceX: clamp(sourceX, 0, imageDimensions.width - 1),
    sourceY: clamp(sourceY, 0, imageDimensions.height - 1),
    sourceWidth: clamp(sourceWidth, 1, imageDimensions.width),
    sourceHeight: clamp(sourceHeight, 1, imageDimensions.height),
    outputSize,
  };
};

export const cropProfileImage = async ({
  file,
  imageDimensions,
  crop,
  displayedSize,
}: ProfileImageCropOptions): Promise<File> => {
  if (!imageDimensions) {
    throw new Error('Image dimensions are not available.');
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);
    const frameSize = Math.min(image.naturalWidth, image.naturalHeight);
    const { sourceX, sourceY, sourceWidth, sourceHeight, outputSize } =
      getCropSourceCoordinates({
        imageDimensions: {
          width: image.naturalWidth,
          height: image.naturalHeight,
        },
        crop,
        frameSize,
        displayedSize,
      });

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
      sourceWidth,
      sourceHeight,
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
