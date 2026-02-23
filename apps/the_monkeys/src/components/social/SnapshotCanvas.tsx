import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { useTheme } from 'next-themes';

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
  lineHeight: number,
  maxLines: number = 3
): number {
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      if (lines.length === maxLines - 1) {
        let trimmed = line.trim();
        while (
          ctx.measureText(trimmed + '…').width > maxWidth &&
          trimmed.length > 0
        ) {
          trimmed = trimmed.slice(0, -1);
        }
        lines.push(trimmed + '…');
        line = '';
        break;
      }
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }

  if (line.trim() && lines.length < maxLines) {
    lines.push(line.trim());
  }

  for (const l of lines) {
    ctx.fillText(l, x, y);
    y += lineHeight;
  }

  return y;
}

export const SnapshotCanvas = ({
  id,
  title,
  description,
  imageURL,
  onTitleChange,
  onDescriptionChange,
  logoURL = '/logo-brand.svg',
  width = 1080,
  height = 1350,
}: {
  id: string;
  title: string;
  description?: string;
  imageURL: string;
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  logoURL?: string;
  width?: number;
  height?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCache = useRef<{
    bg: HTMLImageElement;
    logo: HTMLImageElement;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [canvasError, setCanvasError] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Theme colors
  const colors = isDark
    ? {
        bg: '#121212',
        boxBg: '#2C2C2C',
        boxBorder: '#3F3F3F',
        title: '#FFFFFF',
        desc: 'rgba(255,255,255,0.65)',
        brand: 'rgba(255,255,255,0.35)',
        accent: '#FF5542',
        photoBorder: 'rgba(255,255,255,0.1)',
      }
    : {
        bg: '#FAFAFA',
        boxBg: '#EEEEEE',
        boxBorder: '#CCCCCC',
        title: '#121212',
        desc: 'rgba(18,18,18,0.6)',
        brand: 'rgba(18,18,18,0.35)',
        accent: '#FF5542',
        photoBorder: 'rgba(0,0,0,0.08)',
      };

  // Layout (1080×1350 — Instagram Post, asymmetric editorial)
  const margin = 64;
  // Photo: right-side, overlapping title + desc box
  const photoW = 520;
  const photoH = 650;
  const photoX = width - margin - photoW + 20;
  const photoY = 120;
  const photoR = 10;
  // Title: top-left, overlaps slightly onto the photo
  const titleY = 135;
  const titleMaxW = photoX - margin + 80; // 80px overlap onto photo
  // Description box: overlapped by photo from above
  const boxX = margin;
  const boxY = 620;
  const boxW = width - margin * 2;
  const boxH = 380;
  const boxR = 6;

  const drawBase = useCallback(
    async (ctx: CanvasRenderingContext2D) => {
      ctx.canvas.width = width;
      ctx.canvas.height = height;

      // Canvas background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      let imageSrc: string;
      if (!imageURL) {
        imageSrc = '/social-snapshot-placeholder.png';
      } else if (imageURL.startsWith('/')) {
        imageSrc = imageURL;
      } else if (imageURL.startsWith('http')) {
        imageSrc = `/api/proxy-image?url=${encodeURIComponent(imageURL)}`;
      } else {
        imageSrc = '/social-snapshot-placeholder.png';
      }

      if (
        !imageCache.current ||
        imageCache.current.bg.src !== new URL(imageSrc, location.href).href
      ) {
        const [bg, logo] = await Promise.all([
          loadImage(imageSrc),
          loadImage(logoURL),
        ]);
        imageCache.current = { bg, logo };
      }

      const { bg: image, logo: logoImg } = imageCache.current;

      // --- Description box (filled background + border, drawn first so photo overlaps) ---
      ctx.fillStyle = colors.boxBg;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, boxR);
      ctx.fill();
      ctx.strokeStyle = colors.boxBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Photo: right side, overlapping title and desc zones ---
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, photoR);
      ctx.clip();

      const insetAspect = photoW / photoH;
      const srcAspect = image.width / image.height;
      let sx = 0,
        sy = 0,
        sw = image.width,
        sh = image.height;
      if (srcAspect > insetAspect) {
        sw = image.height * insetAspect;
        sx = (image.width - sw) / 2;
      } else {
        sh = image.width / insetAspect;
        sy = (image.height - sh) / 2;
      }
      ctx.drawImage(image, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
      ctx.restore();

      // Photo border
      ctx.strokeStyle = colors.photoBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, photoR);
      ctx.stroke();

      // --- Orange accent bar — top-left ---
      ctx.fillStyle = colors.accent;
      ctx.fillRect(margin, 100, 50, 5);

      // --- Logo + brand at bottom-right ---
      const logoH = 32;
      const logoW = logoH * 1.21;
      const footerY = boxY + boxH + 60;

      ctx.drawImage(
        logoImg,
        width - margin - logoW - 140,
        footerY - logoH,
        logoW,
        logoH
      );
      ctx.font = '400 30px "DM Sans", sans-serif';
      ctx.fillStyle = colors.brand;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Monkeys', width - margin - 140 + 6, footerY + 2);
    },
    [imageURL, logoURL, width, height, colors]
  );

  const drawText = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Title: top-left, bold, narrow column
      ctx.font = '700 72px "DM Sans", sans-serif';
      ctx.fillStyle = colors.title;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      wrapText(ctx, title, margin, titleY, titleMaxW, 86, 4);

      // Description: inside box, fills the box area
      if (description) {
        const descPadX = 36;
        const descPadY = 32;
        const descMaxW = boxW - descPadX * 2;
        const descMaxH = boxH - descPadY * 2;
        const descLineH = 42;
        const maxDescLines = Math.floor(descMaxH / descLineH);

        ctx.font = '400 30px "DM Sans", sans-serif';
        ctx.fillStyle = colors.desc;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        wrapText(
          ctx,
          description,
          boxX + descPadX,
          boxY + descPadY,
          descMaxW,
          descLineH,
          maxDescLines
        );
      }
    },
    [title, description, width, height, colors]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setLoading(true);
    setCanvasError(false);

    drawBase(ctx)
      .catch((err) => {
        console.error('Error rendering snapshot canvas:', err);
        setCanvasError(true);
      })
      .finally(() => setLoading(false));
  }, [drawBase]);

  const downloadImage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    await drawBase(ctx);
    drawText(ctx);

    const link = document.createElement('a');
    link.download = `social-snapshot-${id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    await drawBase(ctx);
  }, [id, drawBase, drawText]);

  if (canvasError) {
    return (
      <div className='p-6'>
        <p>Error creating Social Snapshot. Try again later.</p>
      </div>
    );
  }

  // Preview overlay positions (percentages of canvas)
  const titleTopPct = (titleY / height) * 100;
  const titleMaxWPct = (titleMaxW / width) * 100;
  const boxTopPct = ((boxY + 32) / height) * 100;
  const boxLeftPct = ((boxX + 36) / width) * 100;
  const boxWidthPct = ((boxW - 72) / width) * 100;
  const boxHeightPct = ((boxH - 64) / height) * 100;
  const accentTopPct = (100 / height) * 100;

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative w-fit h-fit rounded-md overflow-hidden'>
        <canvas ref={canvasRef} className='w-full max-w-[320px]' />

        {!loading && !canvasError && (
          <>
            {/* Orange accent bar */}
            <div
              className='absolute h-[1.5px] bg-brand-orange'
              style={{
                top: `${accentTopPct}%`,
                left: `${(margin / width) * 100}%`,
                width: '15px',
              }}
            />

            {/* Editable title — top-left */}
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onTitleChange?.(e.currentTarget.textContent || '')}
              className='absolute text-left text-text-light dark:text-text-dark font-bold text-[18px] sm:text-[22px] leading-[1.15] bg-transparent outline-none cursor-text rounded hover:bg-text-light/5 dark:hover:bg-text-dark/5 focus:bg-text-light/5 dark:focus:bg-text-dark/5 focus:ring-1 focus:ring-text-light/20 dark:focus:ring-text-dark/20 transition-colors'
              style={{
                top: `${titleTopPct}%`,
                left: `${(margin / width) * 100}%`,
                width: `${titleMaxWPct}%`,
              }}
            >
              {title}
            </div>

            {/* Editable description — fills the box */}
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                onDescriptionChange?.(e.currentTarget.textContent || '')
              }
              className='absolute text-left text-text-light/60 dark:text-text-dark/60 text-[8px] sm:text-[9px] leading-[1.5] bg-transparent outline-none cursor-text rounded hover:bg-text-light/5 dark:hover:bg-text-dark/5 focus:bg-text-light/5 dark:focus:bg-text-dark/5 focus:ring-1 focus:ring-text-light/10 dark:focus:ring-text-dark/10 transition-colors overflow-hidden'
              style={{
                top: `${boxTopPct}%`,
                left: `${boxLeftPct}%`,
                width: `${boxWidthPct}%`,
                height: `${boxHeightPct}%`,
              }}
            >
              {description || 'Click to add description'}
            </div>
          </>
        )}

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
        className='flex rounded-full items-center gap-2 shadow-sm'
        onClick={downloadImage}
        disabled={loading}
      >
        <Icon name='RiDownload2' size={18} />
        <p>Save</p>
      </Button>
    </div>
  );
};
