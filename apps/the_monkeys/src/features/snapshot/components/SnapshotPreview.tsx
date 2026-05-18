'use client';

import { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';

import { getTemplateById } from '../registry';
import { getThemeById } from '../themes';
import { SnapshotInput } from '../types';

export interface SnapshotPreviewProps {
  input: SnapshotInput;
  templateId: string;
  themeId: string;
  accent: string;
  /** Max width of the preview container in CSS pixels. */
  maxPreviewWidth?: number;
  /** Background "stage" colour around the canvas. */
  stageBackground?: string;
  className?: string;
}

/**
 * Renders the selected template at its native px size inside a fixed-size
 * wrapper, then scales the wrapper with CSS `transform` so the visible preview
 * fits the available area without affecting the export pipeline (which still
 * reads the native dimensions via a ref).
 */
export const SnapshotPreview = forwardRef<HTMLDivElement, SnapshotPreviewProps>(
  function SnapshotPreview(
    {
      input,
      templateId,
      themeId,
      accent,
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
      const update = () => {
        const available = maxPreviewWidth ?? el.clientWidth;
        if (!available) return;
        const next = Math.min(1, available / template.width);
        setScale(next);
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, [template.width, maxPreviewWidth]);

    const Render = template.Render;
    const scaledWidth = template.width * scale;
    const scaledHeight = template.height * scale;

    const stageStyle: CSSProperties = {
      width: '100%',
      maxWidth: maxPreviewWidth,
      backgroundColor: stageBackground,
    };

    return (
      <div ref={stageRef} className={className} style={stageStyle}>
        <div
          style={{
            width: scaledWidth,
            height: scaledHeight,
            overflow: 'hidden',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/*
           * The CSS scale lives on this wrapper, NOT on the ref'd
           * element below. If we put `transform` on the export root,
           * html-to-image would serialize the transform into its
           * SVG output and produce a tiny image in the top-left of
           * a native-sized canvas.
           */}
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
                width: template.width,
                height: template.height,
              }}
            >
              <Render input={input} theme={theme} accent={accent} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
