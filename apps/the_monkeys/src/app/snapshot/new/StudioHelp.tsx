import { JsonLd } from '@/components/seo/JsonLd';

export type StudioMode = 'template' | 'x';

export const STUDIO_HELP = {
  x: {
    title: 'Free X / Twitter screenshot generator',
    description:
      'Turn a public X or Twitter post into a PNG image. Paste a tweet link, choose a style and download your screenshot.',
    heading: 'How to make an X screenshot',
    steps: [
      'Copy the link to a public X or Twitter post and paste it in the X post URL field.',
      'Choose a square, portrait or landscape size. Adjust the theme, background and watermark in the style controls.',
      'Check the preview, then use Download or Copy image to save your card.',
    ],
    faqs: [
      {
        question: 'Do I need an account to make an X screenshot?',
        answer:
          'No. The X screenshot tool is free to use without signing in. Paste a public post link to get started.',
      },
      {
        question: 'Which tweet image sizes can I download?',
        answer:
          'Download a PNG screenshot in square (1:1), portrait (4:5) or landscape (16:9) format. Use the Aspect Ratio control to choose a size before exporting.',
      },
      {
        question: 'Why might an X post not load?',
        answer:
          'Use a link containing /status/ and the post ID. Private, deleted or unavailable posts cannot be loaded. If a public post fails, check that it still opens on X and try again later.',
      },
    ],
  },
  template: {
    title: 'Free social image studio',
    description:
      'Create Instagram posts, quote cards and carousels with editable templates. Preview your social image as you create.',
    heading: 'How to create a social image',
    steps: [
      'Choose an image template for your quote, headline or carousel.',
      'Edit the content, then choose a theme, accent and background to suit your post.',
      'Check the preview and download a PNG or JPEG. You can return to the controls to adjust the design.',
    ],
    faqs: [
      {
        question: 'Is the Monkeys image studio free?',
        answer:
          'Yes. Image templates and the X screenshot generator are free to use in your browser.',
      },
      {
        question: 'Do I need an account to create a social image?',
        answer:
          'No. You can create and download an image without signing in. Signing in adds your name and photo to the template byline.',
      },
    ],
  },
} as const;

export function StudioHelp({ mode }: { mode: StudioMode }) {
  const copy = STUDIO_HELP[mode];

  return (
    <section
      aria-labelledby='studio-help-heading'
      className='mt-8 border-t border-border-light pt-6 text-sm dark:border-border-dark'
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: copy.faqs.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        }}
      />
      <h2 id='studio-help-heading' className='font-semibold text-foreground'>
        {copy.heading}
      </h2>
      <ol className='mt-3 list-decimal space-y-2 pl-5 text-foreground/70'>
        {copy.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className='mt-5 grid gap-4 sm:grid-cols-2'>
        {copy.faqs.map(({ question, answer }) => (
          <div key={question} className='min-w-0'>
            <h3 className='font-medium text-foreground'>{question}</h3>
            <p className='mt-1 leading-relaxed text-foreground/70'>{answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
