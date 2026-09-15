import { renderHook, waitFor } from '@testing-library/react';
import QRCode from 'qrcode';
import { describe, expect, it, vi } from 'vitest';

import { CardInput } from '../types';
import { useCardQr } from './useCardQr';

describe('useCardQr', () => {
  const sampleInput: CardInput = {
    contact: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
    },
    socialLinks: [],
  };

  it('indicates isGenerating while QR code promise is in flight, then resolves', async () => {
    let resolveQr!: (value: string) => void;
    vi.spyOn(QRCode, 'toDataURL').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveQr = resolve;
        })
    );

    const { result } = renderHook(() => useCardQr(sampleInput, true));

    // While generating
    expect(result.current.isGenerating).toBe(true);
    expect(result.current.qrDataUrl).toBeUndefined();

    // Resolve promise
    resolveQr('data:image/png;base64,mockQrCode');

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.qrDataUrl).toBe('data:image/png;base64,mockQrCode');
    });
  });

  it('is not generating when QR is disabled', () => {
    const { result } = renderHook(() => useCardQr(sampleInput, false));
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.qrDataUrl).toBeUndefined();
  });
});
