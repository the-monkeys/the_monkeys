'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';

import { fitPreviewScale } from '@/features/snapshot/lib/fitPreviewScale';

import { getTemplateById } from '../registry';
import { getThemeById } from '../themes';
import { CardCustomization, CardInput } from '../types';

export interface CardPreviewProps {
  input: CardInput;
  templateId: string;
  themeId: string;
  customization: CardCustomization;
  qrDataUrl?: string;
  maxPreviewWidth?: number;
  stageBackground?: string;
  className?: string;
}

/**
 * Renders the business card at native pixel size, then CSS-scales to fit
 * the available container — same approach as SnapshotPreview.
 */
export const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  function CardPreview(
    {
      input,
      templateId,
      themeId,
      customization,
      qrDataUrl,
      maxPreviewWidth,
      stageBackground = 'transparent',
      className,
    },
    ref
  ) {
    const template = getTemplateById(templateId);
    const theme = getThemeById(themeId);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
      if (!stageRef.current) return;
      const el = stageRef.current;
      let tries = 0;
      const update = () => {
        const availableW = maxPreviewWidth ?? el.clientWidth;
        if (!availableW) {
          if (tries++ < 12) window.requestAnimationFrame(update);
          return;
        }
        const next = fitPreviewScale(
          template.width,
          template.height,
          availableW
        ).scale;
        setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, [template.width, template.height, maxPreviewWidth]);

    const Render = template.Render;
    const scaledW = template.width * scale;
    const scaledH = template.height * scale;

    return (
      <div
        className={className}
        style={{
          width: '100%',
          backgroundColor:
            stageBackground === 'transparent' ? undefined : stageBackground,
        }}
      >
        {/* Measured content box — no padding, so the card never overflows. */}
        <div
          ref={stageRef}
          className='w-full'
          style={{ maxWidth: maxPreviewWidth }}
        >
          <div
            style={{
              width: scaledW,
              height: scaledH,
              overflow: 'hidden',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div
              style={{
                width: template.width,
                height: template.height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <div
                ref={ref}
                style={{
                  display: 'flex',
                  width: template.width,
                  height: template.height,
                }}
              >
                <Render
                  input={input}
                  theme={theme}
                  customization={customization}
                  qrDataUrl={qrDataUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
