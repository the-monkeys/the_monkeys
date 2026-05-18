'use client';

import { useMemo, useRef } from 'react';

import { useDataUrlImage } from '../hooks/useDataUrlImage';
import { useExport } from '../hooks/useExport';
import { useSnapshotState } from '../hooks/useSnapshotState';
import { getTemplateById } from '../registry';
import { SnapshotInput } from '../types';
import { AccentColorPicker } from './AccentColorPicker';
import { BackgroundPicker } from './BackgroundPicker';
import { DownloadButton } from './DownloadButton';
import { OptionsPanel } from './OptionsPanel';
import { SnapshotPreview } from './SnapshotPreview';
import { TemplatePicker } from './TemplatePicker';
import { ThemePicker } from './ThemePicker';

export interface SnapshotStudioProps {
  input: SnapshotInput;
  /**
   * Pool of candidate background images (e.g. every image embedded in the
   * source blog). Falsy or empty means "no background picker".
   */
  availableImages?: string[];
  /** Optional initial template, defaults to editorial-portrait. */
  initialTemplateId?: string;
  initialThemeId?: string;
  initialAccent?: string;
}

/**
 * Top-level orchestrator. Composer-ready: when the Cast composer is built it
 * will mount this same component inside its media panel with no rewrites.
 */
export const SnapshotStudio = ({
  input,
  availableImages = [],
  initialTemplateId,
  initialThemeId,
  initialAccent,
}: SnapshotStudioProps) => {
  const { state, updateInput, setTemplate, setTheme, setAccent } =
    useSnapshotState({
      initialInput: input,
      initialTemplateId,
      initialThemeId,
      initialAccent,
    });

  // Resolve the chosen background to a data URL so html-to-image can embed it
  // without cross-origin canvas tainting.
  const bgDataUrl = useDataUrlImage(state.input.backgroundImageUrl);
  const renderedInput = useMemo<SnapshotInput>(
    () => ({
      ...state.input,
      backgroundImageUrl: bgDataUrl,
    }),
    [state.input, bgDataUrl]
  );

  const template = getTemplateById(state.templateId);
  const snapshotRef = useRef<HTMLDivElement | null>(null);
  const { exportImage, isExporting, error } = useExport(snapshotRef, {
    width: template.width,
    height: template.height,
    slice: template.slice,
  });

  const filename = `${state.input.title || 'snapshot'}-${template.id}`;

  return (
    <div className='grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(320px,420px)]'>
      <section className='flex min-w-0 flex-col gap-3'>
        <div className='flex items-center justify-between gap-2'>
          <div>
            <h2 className='font-newsreader text-2xl'>{template.label}</h2>
            <p className='text-xs text-foreground/60'>
              {template.width}×{template.height} · {template.aspect}
            </p>
          </div>
        </div>

        <div className='rounded-2xl border bg-foreground-light/30 p-2 dark:bg-foreground-dark/20 sm:p-4'>
          <SnapshotPreview
            ref={snapshotRef}
            input={renderedInput}
            templateId={state.templateId}
            themeId={state.themeId}
            accent={state.accent}
          />
        </div>

        {error ? (
          <p role='alert' className='text-sm text-alert-red'>
            Export failed: {error.message}
          </p>
        ) : null}
      </section>

      <aside className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
            Template
          </h3>
          <TemplatePicker value={state.templateId} onChange={setTemplate} />
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
            Theme
          </h3>
          <ThemePicker value={state.themeId} onChange={setTheme} />
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
            Accent
          </h3>
          <AccentColorPicker value={state.accent} onChange={setAccent} />
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
            Background
          </h3>
          <BackgroundPicker
            value={state.input.backgroundImageUrl}
            images={availableImages}
            overlay={state.input.backgroundOverlay ?? 0.55}
            onChangeImage={(url) => updateInput({ backgroundImageUrl: url })}
            onChangeOverlay={(overlay) =>
              updateInput({ backgroundOverlay: overlay })
            }
          />
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
            Content
          </h3>
          <OptionsPanel input={state.input} onChange={updateInput} />
        </div>

        <div className='sticky bottom-0 -mx-1 mt-2 flex flex-col gap-2 border-t bg-background-light/95 px-1 py-3 dark:bg-background-dark/95'>
          <DownloadButton
            isExporting={isExporting}
            onExport={exportImage}
            filename={filename}
          />
        </div>
      </aside>
    </div>
  );
};
