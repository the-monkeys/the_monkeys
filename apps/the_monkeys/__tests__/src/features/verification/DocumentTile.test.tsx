import { DocumentTile } from '@/features/verification/components/DocumentTile';
import { MAX_DOC_BYTES } from '@/features/verification/constants';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({ default: () => () => null }));
afterEach(cleanup);

describe('verification document feedback', () => {
  it('explains rejected file formats without uploading them', () => {
    const onFile = vi.fn();
    render(
      <DocumentTile
        kind='selfie'
        label='Selfie holding your ID'
        onFile={onFile}
      />
    );
    fireEvent.change(screen.getByTestId('doc-input-selfie'), {
      target: {
        files: [new File(['text'], 'local.txt', { type: 'text/plain' })],
      },
    });
    expect(onFile).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/JPEG|PNG|WebP/);
  });

  it('explains oversized images without uploading them', () => {
    const onFile = vi.fn();
    const file = new File(['png'], 'local.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: MAX_DOC_BYTES + 1 });
    render(
      <DocumentTile
        kind='selfie'
        label='Selfie holding your ID'
        onFile={onFile}
      />
    );
    fireEvent.change(screen.getByTestId('doc-input-selfie'), {
      target: { files: [file] },
    });
    expect(onFile).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/10 MB/);
  });

  it('shows upload progress instead of leaving an empty tile', () => {
    render(
      <DocumentTile
        kind='selfie'
        label='Selfie holding your ID'
        onFile={vi.fn()}
        doc={{ checksum: '', progress: 37 }}
      />
    );
    expect(
      screen
        .getByRole('progressbar', { name: 'Uploading Selfie holding your ID' })
        .getAttribute('aria-valuenow')
    ).toBe('37');
  });

  it('describes a successful upload without exposing its checksum', () => {
    const checksum = 'a'.repeat(64);
    render(
      <DocumentTile
        kind='selfie'
        label='Selfie holding your ID'
        onFile={vi.fn()}
        doc={{ checksum }}
      />
    );
    expect(screen.getByText('Uploaded')).toBeDefined();
    expect(screen.queryByText(/aaaaaaaaaa/)).toBeNull();
  });
});
