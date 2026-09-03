'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useUploadGroupImage } from '@/hooks/groups/useGroupQueries';
import { defaultTimezone } from '@/lib/eventTime';
import {
  GroupBody,
  GroupImageKind,
  GroupItem,
  GroupVisibility,
} from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

type Props = {
  group?: GroupItem;
  saving?: boolean;
  submitLabel: string;
  onSubmit: (body: GroupBody, images?: { logo?: File; cover?: File }) => void;
};

const VISIBILITIES: { value: GroupVisibility; label: string; hint: string }[] =
  [
    { value: 'public', label: 'Public', hint: 'Anyone can find and join' },
    {
      value: 'private',
      label: 'Private',
      hint: 'Members join by request/approval',
    },
    { value: 'unlisted', label: 'Unlisted', hint: 'Reachable by link only' },
  ];

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function GroupForm({ group, saving, submitLabel, onSubmit }: Props) {
  const [visibility, setVisibility] = useState<GroupVisibility>(
    group?.visibility || 'public'
  );

  const initial = useMemo(
    () => ({
      name: group?.name || '',
      description: group?.description || '',
      city: group?.city || '',
      region: group?.region || '',
      country: group?.country || '',
      timezone: group?.timezone || defaultTimezone(),
      topics: group?.topics?.join(', ') || '',
      cover_image: group?.cover_image || '',
      logo_image: group?.logo_image || '',
    }),
    [group]
  );

  // Image URLs are controlled so the uploader can write the stored path back in
  // after an upload, while still allowing manual URL entry.
  const [logoImage, setLogoImage] = useState(initial.logo_image);
  const [coverImage, setCoverImage] = useState(initial.cover_image);
  // Before the group exists there is no slug to upload against, so files picked
  // at creation are held locally (with object-URL previews) and uploaded right
  // after the group is created. In edit mode uploads happen immediately.
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(
    () => () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    },
    [logoPreview, coverPreview]
  );

  const pickLogo = (file: File) => {
    setLogoImage('');
    setLogoFile(file);
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };
  const pickCover = (file: File) => {
    setCoverImage('');
    setCoverFile(file);
    setCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };
  const typeLogoUrl = (v: string) => {
    setLogoImage(v);
    if (v && logoFile) {
      setLogoFile(null);
      setLogoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
    }
  };
  const typeCoverUrl = (v: string) => {
    setCoverImage(v);
    if (v && coverFile) {
      setCoverFile(null);
      setCoverPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body: GroupBody = {
      name: String(form.get('name') || '').trim(),
      description: String(form.get('description') || '').trim(),
      visibility,
      city: String(form.get('city') || '').trim(),
      region: String(form.get('region') || '').trim(),
      country: String(form.get('country') || '').trim(),
      timezone: String(form.get('timezone') || defaultTimezone()),
      cover_image: coverImage.trim(),
      logo_image: logoImage.trim(),
      topics: splitList(String(form.get('topics') || '')),
    };
    if (!body.name) return;
    onSubmit(body, {
      logo: logoFile ?? undefined,
      cover: coverFile ?? undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <Field label='Group name'>
        <Input
          name='name'
          required
          defaultValue={initial.name}
          maxLength={120}
          placeholder='e.g. Bengaluru Rust Developers'
        />
      </Field>

      <Field label='What is this group about?'>
        <TextArea
          name='description'
          defaultValue={initial.description}
          rows={5}
          className='min-h-32'
        />
      </Field>

      <fieldset>
        <legend className='mb-2 font-inter text-sm font-medium'>
          Visibility
        </legend>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
          {VISIBILITIES.map((v) => (
            <button
              key={v.value}
              type='button'
              onClick={() => setVisibility(v.value)}
              className={`rounded-lg border-2 px-3 py-2 text-left font-inter transition-colors ${
                visibility === v.value
                  ? 'border-brand-orange bg-brand-orange/5'
                  : 'border-border-light dark:border-border-dark'
              }`}
            >
              <span className='block text-sm font-semibold'>{v.label}</span>
              <span className='block text-xs text-gray-500'>{v.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Field label='City'>
          <Input name='city' defaultValue={initial.city} />
        </Field>
        <Field label='Region / State'>
          <Input name='region' defaultValue={initial.region} />
        </Field>
        <Field label='Country'>
          <Input name='country' defaultValue={initial.country} />
        </Field>
      </div>

      <Field label='Timezone'>
        <Input name='timezone' defaultValue={initial.timezone} />
      </Field>

      <Field label='Topics (comma separated)'>
        <Input
          name='topics'
          defaultValue={initial.topics}
          placeholder='rust, systems, meetup'
        />
      </Field>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <ImageField
          label='Logo image'
          kind='logo'
          slug={group?.slug}
          value={logoImage}
          onChange={typeLogoUrl}
          onFileSelected={pickLogo}
          pendingPreview={logoPreview}
        />
        <ImageField
          label='Cover image'
          kind='cover'
          slug={group?.slug}
          value={coverImage}
          onChange={typeCoverUrl}
          onFileSelected={pickCover}
          pendingPreview={coverPreview}
        />
      </div>

      <Button
        type='submit'
        variant='brand'
        disabled={saving}
        className='w-full sm:w-auto'
      >
        {saving ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}

// ImageField uploads a logo/cover to storage once the group exists (and so has
// a slug) and writes the returned path back into the controlled value. Before
// the group exists it captures the file locally (previewed via pendingPreview)
// and defers the upload to the parent, which runs it right after creation.
function ImageField({
  label,
  kind,
  slug,
  value,
  onChange,
  onFileSelected,
  pendingPreview,
}: {
  label: string;
  kind: GroupImageKind;
  slug?: string;
  value: string;
  onChange: (v: string) => void;
  onFileSelected?: (file: File) => void;
  pendingPreview?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const upload = useUploadGroupImage(slug || '');

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    if (slug) {
      upload.mutate(
        { kind, file },
        {
          onSuccess: (res) => res.url && onChange(res.url),
          onError: () => setError('Upload failed. Try a smaller image.'),
        }
      );
      return;
    }
    onFileSelected?.(file);
  };

  const previewSrc = pendingPreview || value;

  return (
    <div className='space-y-1.5'>
      <Label className='font-inter text-sm'>{label}</Label>

      <div className='flex items-center gap-3'>
        {previewSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt={`${label} preview`}
            className={`rounded-lg border border-border-light object-cover dark:border-border-dark ${
              kind === 'logo' ? 'h-14 w-14' : 'h-14 w-24'
            }`}
          />
        ) : (
          <div
            className={`flex items-center justify-center rounded-lg border border-dashed border-border-light text-xs text-gray-400 dark:border-border-dark ${
              kind === 'logo' ? 'h-14 w-14' : 'h-14 w-24'
            }`}
          >
            None
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={onPick}
          />
          <Button
            type='button'
            variant='secondary'
            disabled={upload.isPending}
            onClick={() => inputRef.current?.click()}
            className='min-h-[36px]'
          >
            {upload.isPending ? 'Uploading…' : 'Upload'}
          </Button>
          {!slug && (
            <span className='text-xs text-gray-400'>
              Uploads when you save the group.
            </span>
          )}
        </div>
      </div>

      <Input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='…or paste an image URL'
      />
      {error && <p className='text-xs text-brand-orange'>{error}</p>}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-1.5'>
      <Label className='font-inter text-sm'>{label}</Label>
      {children}
    </div>
  );
}
