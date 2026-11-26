import { VerificationPanel } from '@/features/verification/components/VerificationPanel';
import { MAX_DOC_BYTES } from '@/features/verification/constants';
import type {
  VerificationRequest,
  VerificationStatus,
} from '@/services/verification/verificationTypes';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({ useVerification: vi.fn() }));
vi.mock('@/features/verification/hooks/useMyVerification', () => ({
  useMyVerification: hooks.useVerification,
}));
vi.mock('next/dynamic', () => ({ default: () => () => null }));

type MockMutation = {
  isPending: boolean;
  mutate: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
};
let state: {
  accountIdentity?: string;
  none: boolean;
  request?: VerificationRequest;
  isLoading: boolean;
  isError: boolean;
  refetch: ReturnType<typeof vi.fn>;
  uploadDoc: MockMutation;
  submit: MockMutation;
  cancel: MockMutation;
};
beforeEach(() => {
  state = {
    none: true,
    request: undefined,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    uploadDoc: { isPending: false, mutate: vi.fn(), reset: vi.fn() },
    submit: { isPending: false, mutate: vi.fn(), reset: vi.fn() },
    cancel: { isPending: false, mutate: vi.fn(), reset: vi.fn() },
  };
  hooks.useVerification.mockImplementation(() => state);
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function showStatus(
  status: VerificationStatus,
  extra: Partial<VerificationRequest> = {}
) {
  state.none = false;
  state.request = {
    id: 'local-request',
    username: 'local_verify',
    verification_type: 'id_document',
    status,
    created_at: '2026-11-18T08:00:00Z',
    ...extra,
  };
}

describe('verification settings states', () => {
  it('requires government ID with no social-proof alternative', () => {
    render(<VerificationPanel />);
    expect(
      screen.getByRole('heading', { name: 'Verify with a government ID' })
    ).toBeDefined();
    expect(screen.queryByRole('radio')).toBeNull();
    expect(screen.queryByText(/Social proof/i)).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Submit request' })
    ).toBeDefined();
  });

  it('keeps an unknown failed status distinct from a new application', () => {
    state.isError = true;
    render(<VerificationPanel />);
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Submit request' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(state.refetch).toHaveBeenCalledOnce();
  });

  it('announces loading without flashing the submission form', () => {
    state.isLoading = true;
    render(<VerificationPanel />);
    expect(
      screen.getByRole('status', { name: 'Loading verification status' })
    ).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Submit request' })).toBeNull();
  });

  it('shows useful approved information and a profile link', () => {
    showStatus('approved');
    render(<VerificationPanel />);
    expect(
      screen.getByRole('heading', { name: "You're verified" })
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'View profile' }).getAttribute('href')
    ).toBe('/local_verify');
    expect(screen.queryByRole('button', { name: 'Submit request' })).toBeNull();
  });

  it('explains pending review and confirms withdrawal before calling the API', () => {
    showStatus('pending');
    render(<VerificationPanel />);
    expect(
      screen.getByRole('heading', { name: 'Request received' })
    ).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel request' }));
    expect(
      screen.getByRole('dialog', { name: 'Cancel verification request?' })
    ).toBeDefined();
    expect(state.cancel.mutate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Keep request' }));
    expect(state.cancel.mutate).not.toHaveBeenCalled();
    expect(state.submit.reset).not.toHaveBeenCalled();
  });

  it('explains under-review status without offering a second application', () => {
    showStatus('under_review');
    render(<VerificationPanel />);
    expect(
      screen.getByRole('heading', { name: 'Review in progress' })
    ).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Submit request' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel request' })).toBeNull();
  });

  it('preserves reviewer feedback and the resubmission path', () => {
    showStatus('rejected', {
      rejection_reason: 'Please upload a clearer front image.',
    });
    render(<VerificationPanel />);
    expect(
      screen.getByText('Please upload a clearer front image.')
    ).toBeDefined();
    fireEvent.click(
      screen.getByRole('button', { name: 'Update and resubmit' })
    );
    expect(
      screen.getByRole('button', { name: 'Submit request' })
    ).toBeDefined();
  });

  it('does not expose a new form while the status is unknown', () => {
    state.none = false;
    render(<VerificationPanel />);
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Submit request' })).toBeNull();
  });

  it('shows all named countries and territories including Kosovo with no Other option', () => {
    render(<VerificationPanel />);
    fireEvent.keyDown(
      screen.getByRole('combobox', { name: 'Issuing country / territory' }),
      { key: 'ArrowDown' }
    );
    expect(screen.getAllByRole('option')).toHaveLength(250);
    expect(screen.getByRole('option', { name: 'Nepal' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Sri Lanka' })).toBeDefined();
    expect(screen.getByRole('option', { name: 'Kosovo' })).toBeDefined();
    expect(
      screen.queryByRole('option', { name: /Other|not listed/i })
    ).toBeNull();
  });

  it('offers all five government ID categories without a country restriction', () => {
    render(<VerificationPanel />);
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Document type' }), {
      key: 'ArrowDown',
    });
    expect(screen.getAllByRole('option')).toHaveLength(5);
    expect(
      screen.getByRole('option', { name: 'Other government-issued ID' })
    ).toBeDefined();
    expect(screen.getByRole('option', { name: 'Passport' })).toBeDefined();
  });

  it('calls cancellation only after explicit confirmation and retains the request reference', () => {
    showStatus('pending');
    render(<VerificationPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel request' }));
    const dialog = screen.getByRole('dialog', {
      name: 'Cancel verification request?',
    });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel request' })
    );
    expect(state.cancel.mutate).toHaveBeenCalledWith(
      'local-request',
      expect.any(Object)
    );
    expect(state.submit.reset).not.toHaveBeenCalled();
    act(() => state.cancel.mutate.mock.calls[0][1].onSuccess());
    expect(state.submit.reset).toHaveBeenCalledOnce();
  });

  it('keeps the submission attempt after cancellation fails', () => {
    showStatus('pending');
    render(<VerificationPanel />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel request' }));
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Cancel request',
      })
    );
    act(() =>
      state.cancel.mutate.mock.calls[0][1].onError(new Error('network error'))
    );
    expect(state.submit.reset).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'ISO string', value: '2026-11-18T08:00:00Z' },
    {
      name: 'protobuf number seconds',
      value: {
        seconds: Date.parse('2026-11-18T08:00:00Z') / 1000,
        nanos: 123000000,
      },
    },
    {
      name: 'protobuf string seconds',
      value: {
        seconds: String(Date.parse('2026-11-18T08:00:00Z') / 1000),
        nanos: 0,
      },
    },
  ])('shows the submitted date from $name', ({ value }) => {
    showStatus('pending', { created_at: value });
    render(<VerificationPanel />);
    expect(
      screen.getByText(
        new Date('2026-11-18T08:00:00Z').toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      )
    ).toBeDefined();
    expect(screen.queryByText('Date unavailable')).toBeNull();
  });

  it.each([
    { seconds: 'bad' },
    { seconds: 1e30 },
    { seconds: 1794988800, nanos: Infinity },
  ])('handles invalid protobuf timestamps safely: %j', (created_at) => {
    showStatus('pending', { created_at });
    render(<VerificationPanel />);
    expect(screen.getByText('Date unavailable')).toBeDefined();
    expect(screen.queryByText(/Invalid Date/)).toBeNull();
  });

  it('uses a neutral label for historical professional requests', () => {
    showStatus('approved', { verification_type: 'professional' });
    render(<VerificationPanel />);
    expect(screen.getByText('Previous verification method')).toBeDefined();
    expect(screen.queryByText('Social proof (previous request)')).toBeNull();
  });

  it('handles malformed dates without displaying Invalid Date', () => {
    showStatus('under_review', { created_at: 'not-a-date' });
    render(<VerificationPanel />);
    expect(screen.getByText('Date unavailable')).toBeDefined();
    expect(screen.queryByText(/Invalid Date/)).toBeNull();
  });

  it('preserves all saved ID fields and document references when resubmitting', async () => {
    const checksum = 'a'.repeat(64);
    showStatus('rejected', {
      country: 'NP',
      id_document_type: 'government_id',
      additional_info: 'Existing review context',
      selfie_checksum: checksum,
      id_front_checksum: checksum,
      id_back_checksum: checksum,
    });
    render(<VerificationPanel />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Update and resubmit' })
    );
    expect(state.submit.reset).toHaveBeenCalledOnce();
    state.submit.reset.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    await waitFor(() =>
      expect(state.submit.mutate).toHaveBeenCalledWith(
        {
          verification_type: 'id_document',
          country: 'NP',
          id_document_type: 'government_id',
          additional_info: 'Existing review context',
          selfie_checksum: checksum,
          id_front_checksum: checksum,
          id_back_checksum: checksum,
        },
        expect.any(Object)
      )
    );
    act(() =>
      state.submit.mutate.mock.calls[0][1].onError(new Error('network error'))
    );
    expect(state.submit.reset).not.toHaveBeenCalled();
  });

  it('renders historical social proof but requires government ID on resubmission', async () => {
    showStatus('rejected', {
      verification_type: 'social_proof',
      additional_info: 'Existing links',
    });
    render(<VerificationPanel />);
    expect(screen.getByText('Social proof (previous request)')).toBeDefined();
    fireEvent.click(
      screen.getByRole('button', { name: 'Update and resubmit' })
    );
    expect(
      screen.getByRole('heading', { name: 'Verify with a government ID' })
    ).toBeDefined();
    expect(screen.queryByText(/Social proof/i)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    await waitFor(() =>
      expect(screen.getByText('Selfie is required')).toBeDefined()
    );
    expect(state.submit.mutate).not.toHaveBeenCalled();
  });

  it('keeps legacy OT readable and asks for an actual issuing country on resubmission', async () => {
    const checksum = 'a'.repeat(64);
    showStatus('rejected', {
      country: 'OT',
      id_document_type: 'passport',
      selfie_checksum: checksum,
      id_front_checksum: checksum,
    });
    render(<VerificationPanel />);
    expect(screen.getByText('Country not specified')).toBeDefined();
    fireEvent.click(
      screen.getByRole('button', { name: 'Update and resubmit' })
    );
    expect(
      screen.getByText(/Your previous request did not specify a country/)
    ).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    await waitFor(() =>
      expect(
        screen.getByText('Choose the country that issued your ID')
      ).toBeDefined()
    );
    expect(state.submit.mutate).not.toHaveBeenCalled();
  });

  it('shows actual upload progress, blocks submission and recovers after a failed upload', () => {
    render(<VerificationPanel />);
    const file = new File(['image'], 'selfie.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('doc-input-selfie'), {
      target: { files: [file] },
    });
    const [upload, callbacks] = state.uploadDoc.mutate.mock.calls[0];
    act(() => upload.onProgress(37));
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
      '37'
    );
    expect(
      screen
        .getByRole('button', { name: 'Submit request' })
        .hasAttribute('disabled')
    ).toBe(true);
    act(() => callbacks.onError(new Error('upload failed')));
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByRole('alert').textContent).toMatch(/try again/i);
    expect(
      screen
        .getByRole('button', { name: /Retry upload Selfie/ })
        .hasAttribute('disabled')
    ).toBe(false);
    expect(
      screen
        .getByRole('button', { name: 'Submit request' })
        .hasAttribute('disabled')
    ).toBe(false);
    fireEvent.change(screen.getByTestId('doc-input-selfie'), {
      target: { files: [file] },
    });
    expect(state.uploadDoc.mutate).toHaveBeenCalledTimes(2);
    act(() =>
      state.uploadDoc.mutate.mock.calls[1][1].onSuccess({
        checksum: 'b'.repeat(64),
      })
    );
    expect(screen.getByText('Uploaded')).toBeDefined();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it.each(['success', 'error'])(
    'clears private form state on account switch and ignores late upload %s callbacks',
    (outcome) => {
      const checksum = 'a'.repeat(64);
      state.accountIdentity = 'account-a';
      showStatus('rejected', {
        country: 'NP',
        id_document_type: 'passport',
        additional_info: 'Private notes from account A',
        selfie_checksum: checksum,
        id_front_checksum: checksum,
      });
      const { rerender } = render(<VerificationPanel />);
      fireEvent.click(
        screen.getByRole('button', { name: 'Update and resubmit' })
      );
      fireEvent.change(screen.getByTestId('doc-input-id_front'), {
        target: {
          files: [new File(['image'], 'front.png', { type: 'image/png' })],
        },
      });
      const [upload, callbacks] = state.uploadDoc.mutate.mock.calls[0];
      state = {
        ...state,
        accountIdentity: 'account-b',
        none: true,
        request: undefined,
      };
      rerender(<VerificationPanel />);
      expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe(
        ''
      );
      expect(screen.queryByText('Uploaded')).toBeNull();
      expect(screen.queryByRole('progressbar')).toBeNull();
      act(() => {
        upload.onProgress(75);
        if (outcome === 'success') callbacks.onSuccess({ checksum });
        else callbacks.onError(new Error('Account A upload failed'));
      });
      expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe(
        ''
      );
      expect(screen.queryByText('Uploaded')).toBeNull();
      expect(screen.queryByRole('progressbar')).toBeNull();
      expect(screen.queryByRole('alert')).toBeNull();
    }
  );

  it('does not submit an old document reference after its replacement fails', async () => {
    const checksum = 'a'.repeat(64);
    showStatus('rejected', {
      country: 'NP',
      id_document_type: 'passport',
      selfie_checksum: checksum,
      id_front_checksum: checksum,
    });
    render(<VerificationPanel />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Update and resubmit' })
    );
    const file = new File(['image'], 'front.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('doc-input-id_front'), {
      target: { files: [file] },
    });
    act(() =>
      state.uploadDoc.mutate.mock.calls[0][1].onError(
        new Error('replacement failed')
      )
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    });
    expect(state.submit.mutate).not.toHaveBeenCalled();
    fireEvent.change(screen.getByTestId('doc-input-id_front'), {
      target: { files: [file] },
    });
    act(() =>
      state.uploadDoc.mutate.mock.calls[1][1].onSuccess({
        checksum: 'b'.repeat(64),
      })
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    });
    expect(state.submit.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id_front_checksum: 'b'.repeat(64),
        selfie_checksum: checksum,
      }),
      expect.any(Object)
    );
  });

  it.each(['invalid format', 'oversized image'])(
    'requires a successful upload after a replacement fails validation: %s',
    async (reason) => {
      const checksum = 'a'.repeat(64);
      showStatus('rejected', {
        country: 'NP',
        id_document_type: 'passport',
        selfie_checksum: checksum,
        id_front_checksum: checksum,
      });
      render(<VerificationPanel />);
      fireEvent.click(
        screen.getByRole('button', { name: 'Update and resubmit' })
      );
      const file = new File(['image'], 'front.png', {
        type: reason === 'invalid format' ? 'text/plain' : 'image/png',
      });
      if (reason === 'oversized image')
        Object.defineProperty(file, 'size', { value: MAX_DOC_BYTES + 1 });
      fireEvent.change(screen.getByTestId('doc-input-id_front'), {
        target: { files: [file] },
      });
      expect(state.uploadDoc.mutate).not.toHaveBeenCalled();
      expect(screen.getByRole('alert').textContent).toMatch(
        reason === 'invalid format' ? /JPEG|PNG|WebP/ : /10 MB/
      );
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
      });
      expect(state.submit.mutate).not.toHaveBeenCalled();
      const validFile = new File(['image'], 'front.png', { type: 'image/png' });
      fireEvent.change(screen.getByTestId('doc-input-id_front'), {
        target: { files: [validFile] },
      });
      act(() =>
        state.uploadDoc.mutate.mock.calls[0][1].onSuccess({
          checksum: 'b'.repeat(64),
        })
      );
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
      });
      expect(state.submit.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          id_front_checksum: 'b'.repeat(64),
          selfie_checksum: checksum,
        }),
        expect.any(Object)
      );
    }
  );
});
