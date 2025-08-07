import { useEffect, useRef, useState } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

import Icon from '../icon';
import { Loader } from '../loader';

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let lineCount = 0;
  let yOffset = 3 * 32;

  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lineCount++;
      yOffset -= 52;

      if (lineCount === 3) {
        let trimmedLine = line.trim();

        while (
          ctx.measureText(trimmedLine + '…').width > maxWidth &&
          trimmedLine.length > 0
        ) {
          trimmedLine = trimmedLine.slice(0, -1);
        }

        lines.push(trimmedLine + '...');
        break;
      } else {
        lines.push(line.trim());
        line = words[n] + ' ';
      }
    } else {
      line = testLine;
    }
  }

  if (lines.length < 3) {
    lines.push(line.trim());
  }

  y += yOffset;

  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
}

export const SnapshotCanvas = ({
  title,
  imageURL,
  logoURL = '/logo-brand.svg',
  width = 1080,
  height = 1350,
}: {
  title: string;
  imageURL: string;
  logoURL?: string;
  width?: number;
  height?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [canvasError, setCanvasError] = useState(false);

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      const canvasAspect = width / height;

      try {
        const imageSrc = imageURL?.startsWith('http')
          ? `/api/proxy-image?url=${encodeURIComponent(imageURL)}`
          : '/social-snapshot-placeholder.png';

        // background image
        const [image, logoImg] = await Promise.all([
          loadImage(imageSrc),
          loadImage(logoURL),
        ]);

        const imgAspect = (image.width * 0.8) / (image.height * 0.8);

        let sx = 0,
          sy = 0,
          sw = image.width,
          sh = image.height;
        if (imgAspect > canvasAspect) {
          sw = image.height * canvasAspect;
          sx = (image.width - sw) / 2;
        } else {
          sh = image.width / canvasAspect;
          sy = (image.height - sh) / 2;
        }

        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);

        // overlay gradient
        const gradient = ctx.createLinearGradient(0, height, 0, height * 0.4);

        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.6)');
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // title section
        ctx.font = '550 60px Helvetica, sans-serif';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 7;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const paddingX = 52;
        const paddingY = 32;

        wrapText(ctx, title, width / 2, height - 250, width - paddingX * 2, 68);

        ctx.save();

        // footer section
        const logoHeight = 40;
        const logoWidth = logoHeight * 1.21;

        ctx.drawImage(
          logoImg!,
          width - logoWidth - 200,
          height - logoHeight - paddingY,
          logoWidth,
          logoHeight
        );

        ctx.font = '450 38px Helvetica, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';

        ctx.fillText(
          'Monkeys',
          width - logoWidth - 200 + logoWidth + 12,
          height - paddingY + 5
        );
      } catch (error) {
        console.log('error loading proxy image');
        setCanvasError(true);
      } finally {
        setLoading(false);
      }
    };

    draw();
  }, [title, imageURL, logoURL, width, height]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'social-snapshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (canvasError) {
    return (
      <div className='p-6'>
        <p>Error creating Social Snapshot. Try again later.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative w-fit h-fit bg-foreground-light/80 dark:bg-foreground-dark/80 rounded-md overflow-hidden'>
        <canvas ref={canvasRef} className='w-full max-w-[320px]' />

        {!canvasError && loading && (
          <>
            <Skeleton className='absolute top-0 left-0 z-10 w-full h-full' />
            <Loader
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-brand-orange'
              size={50}
            />
          </>
        )}
      </div>

      <Button
        className='flex items-center gap-2 shadow-md'
        onClick={downloadImage}
        disabled={loading}
      >
        <Icon name='RiDownload2' size={18} />
        <p>Download</p>
      </Button>
    </div>
  );
};
