import * as inlineLib from '@/features/snapshot/lib/inlineImagesForExport';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useExportCard } from './useExportCard';

vi.mock('html-to-image', () => ({
  toBlob: vi
    .fn()
    .mockResolvedValue(new Blob(['fake-card-bytes'], { type: 'image/png' })),
}));

describe('useExportCard', () => {
  it('calls inlineImagesForExport on the card node before generating blob', async () => {
    const inlineSpy = vi
      .spyOn(inlineLib, 'inlineImagesForExport')
      .mockResolvedValue();
    const div = document.createElement('div');
    const nodeRef = { current: div };

    const { result } = renderHook(() =>
      useExportCard(nodeRef, { width: 1050, height: 600 })
    );

    const blob = await result.current.exportImage({ download: false });
    expect(blob).toBeTruthy();
    expect(inlineSpy).toHaveBeenCalledWith(div);
  });
});
