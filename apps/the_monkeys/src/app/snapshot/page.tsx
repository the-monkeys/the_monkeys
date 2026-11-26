import Link from 'next/link';

import { Button } from '@the-monkeys/ui/atoms/button';

import SnapshotPicker from './SnapshotPicker';

export default function SnapshotPage() {
  return (
    <div className='mx-auto w-full min-w-0 max-w-5xl'>
      <header className='flex flex-col gap-4 px-4 py-8'>
        <p className='text-sm font-semibold text-brand-orange'>
          Monkeys Studio
        </p>
        <h1 className='font-newsreader text-3xl sm:text-4xl'>
          Snapshot Studio: turn your writing into social images
        </h1>
        <p className='max-w-2xl text-foreground/70'>
          Create a quote card, an Instagram carousel or a portrait from a
          headline and a short description. Choose a template, edit the text and
          download a PNG or JPEG to share yourself.
        </p>
        <p className='max-w-2xl text-sm text-foreground/60'>
          Start with a blank canvas without signing in. To use one of your
          published Monkeys posts, sign in and choose it below.
        </p>
        <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
          <Button asChild className='min-h-11'>
            <Link href='/snapshot/new'>Open image Studio</Link>
          </Button>
          <Button asChild variant='outline' className='min-h-11'>
            <Link href='/snapshot/new?view=x'>Create an X screenshot</Link>
          </Button>
        </div>
      </header>

      <SnapshotPicker />

      <section
        aria-labelledby='snapshot-workflow'
        className='flex flex-col gap-5 border-t px-4 py-8'
      >
        <h2 id='snapshot-workflow' className='font-newsreader text-2xl'>
          Make a clear image from one idea
        </h2>
        <ol className='grid gap-4 sm:grid-cols-3'>
          <li className='flex flex-col gap-2 rounded-xl border p-4'>
            <h3 className='font-semibold'>1. Pick the message</h3>
            <p className='text-sm text-foreground/70'>
              Use a published post or type your own headline, description and
              quote. Keep one main point so the card is easy to read.
            </p>
          </li>
          <li className='flex flex-col gap-2 rounded-xl border p-4'>
            <h3 className='font-semibold'>2. Choose the format</h3>
            <p className='text-sm text-foreground/70'>
              Try a quote card for a short excerpt, a portrait for a headline or
              a carousel for several points. Adjust the theme and accent in the
              preview.
            </p>
          </li>
          <li className='flex flex-col gap-2 rounded-xl border p-4'>
            <h3 className='font-semibold'>3. Review and download</h3>
            <p className='text-sm text-foreground/70'>
              Check the wording, attribution and readability before exporting as
              PNG or JPEG. Add a link to the full post when you share it.
            </p>
          </li>
        </ol>
        <div className='flex flex-col gap-2'>
          <h3 className='font-newsreader text-xl'>
            Working with a public X post?
          </h3>
          <p className='max-w-2xl text-sm text-foreground/70'>
            Open the X screenshot tab and paste the public post URL to create a
            screenshot card. Review the preview and keep the original source
            with your share. Loading a post depends on its availability on X.
          </p>
        </div>
      </section>
    </div>
  );
}
