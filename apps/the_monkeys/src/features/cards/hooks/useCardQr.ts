'use client';

import { useEffect, useMemo, useState } from 'react';

import QRCode from 'qrcode';

import { generateVCard } from '../lib/vcard';
import { CardInput } from '../types';

/**
 * Derives a scannable QR code (PNG data URL) that encodes the card's contact
 * as a vCard, so anyone can scan it and save the contact instantly.
 *
 * Generation is async and debounced by React's effect scheduling; the returned
 * value is `undefined` until the first code is ready or when `enabled` is false.
 */
export interface CardQrResult {
  qrDataUrl: string | undefined;
  isGenerating: boolean;
}

export const useCardQr = (input: CardInput, enabled: boolean): CardQrResult => {
  const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  const hasContact = Boolean(
    input.contact.firstName || input.contact.lastName || input.contact.email
  );

  const vcard = useMemo(
    () => generateVCard(input.contact, input.socialLinks),
    [input.contact, input.socialLinks]
  );

  useEffect(() => {
    if (!enabled || !hasContact) {
      setDataUrl(undefined);
      setIsGenerating(false);
      return;
    }

    let cancelled = false;
    setIsGenerating(true);
    QRCode.toDataURL(vcard, {
      errorCorrectionLevel: 'M',
      margin: 0,
      width: 512,
      color: { dark: '#0A0A0AFF', light: '#FFFFFFFF' },
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDataUrl(undefined);
          setIsGenerating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [vcard, enabled, hasContact]);

  return { qrDataUrl: dataUrl, isGenerating };
};
