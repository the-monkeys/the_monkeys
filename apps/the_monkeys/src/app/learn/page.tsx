import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/JsonLd';
import { selectDeveloperLearningPosts } from '@/lib/learningDiscovery';
import { canonicalPostTitleSlug } from '@/lib/postUrl';
import {
  LEGAL_PUBLISHER_ID,
  MONKEYS_WEBSITE_ID,
  absoluteUrl,
  normalizeSeoText,
  pageMetadata,
} from '@/lib/seo';
import { fetchPublicPosts } from '@/lib/seoCatalog';

export const metadata: Metadata = pageMetadata({
  title: 'Developer Learning: Read, Build and Test | Monkeys',
  description:
    'Explore public developer posts on programming, web development and databases, with practical guidance for turning a technical article into a small experiment.',
  path: '/learn',
});

export default async function LearnPage() {
  const posts = selectDeveloperLearningPosts(await fetchPublicPosts());

  return (
    <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-8 px-4 py-8'>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${absoluteUrl('/learn')}#collection`,
          url: absoluteUrl('/learn'),
          name: 'Developer Learning on Monkeys',
          description: metadata.description,
          isPartOf: { '@id': MONKEYS_WEBSITE_ID },
          publisher: { '@id': LEGAL_PUBLISHER_ID },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: posts.length,
            itemListElement: posts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: normalizeSeoText(post.title, post.title.length),
              url: absoluteUrl(
                `/blog/${canonicalPostTitleSlug(post.title)}-${encodeURIComponent(post.blog_id)}`
              ),
            })),
          },
        }}
      />
      <header className='flex flex-col gap-4'>
        <p className='text-sm font-semibold text-brand-orange'>
          Read, build, test
        </p>
        <h1 className='font-newsreader text-3xl sm:text-4xl'>
          Developer learning, one small experiment at a time
        </h1>
        <p className='max-w-2xl text-foreground/70'>
          Use community writing to explore programming, web development and
          databases. Pick a question you can test in a small project, then use
          the reading list below to find an explanation to work through.
        </p>
      </header>

      <section
        aria-labelledby='learning-method'
        className='flex flex-col gap-4'
      >
        <h2 id='learning-method' className='font-newsreader text-2xl'>
          Turn a technical article into something you can use
        </h2>
        <ol className='grid gap-4 md:grid-cols-3'>
          <li className='flex flex-col gap-2 rounded-xl border p-4'>
            <h3 className='font-semibold'>1. Choose one question</h3>
            <p className='text-sm text-foreground/70'>
              Write down what you want to understand before reading. For a
              database article, ask which query an index helps and what it costs
              to maintain. For a web article, identify the request or user
              action you want to follow.
            </p>
          </li>
          <li className='flex flex-col gap-2 rounded-xl border p-4'>
            <h3 className='font-semibold'>2. Reproduce a small example</h3>
            <p className='text-sm text-foreground/70'>
              Check prerequisites and library versions against the official
              documentation. Run the smallest example in a local project with
              sample data, then record the input, expected result and actual
              result. Read commands before running them.
            </p>
          </li>
          <li className='flex flex-col gap-2 rounded-xl border p-4'>
            <h3 className='font-semibold'>3. Change one thing and test</h3>
            <p className='text-sm text-foreground/70'>
              Try an empty input, an invalid value or a failed request. Explain
              why the result changed, add a test for the behavior you need and
              keep a short note of what remains uncertain.
            </p>
          </li>
        </ol>
      </section>

      <section
        aria-labelledby='developer-reading'
        className='flex flex-col gap-4'
      >
        <h2 id='developer-reading' className='font-newsreader text-2xl'>
          Public developer reading
        </h2>
        <p className='max-w-2xl text-sm text-foreground/70'>
          This selection includes up to twelve public posts with programming,
          web development or database topics, or a specific technology in the
          title. These are community articles, not a sequential course. Check
          each article for its assumptions and sources.
        </p>
        {posts.length ? (
          <ul className='grid gap-4 sm:grid-cols-2'>
            {posts.map((post) => (
              <li
                key={post.blog_id}
                className='min-w-0 rounded-xl border bg-foreground-light/30 p-4 dark:bg-foreground-dark/20'
              >
                <article className='flex h-full flex-col gap-3'>
                  <h3 className='break-words font-newsreader text-xl'>
                    <Link
                      href={`/blog/${canonicalPostTitleSlug(post.title)}-${encodeURIComponent(post.blog_id)}`}
                      className='underline decoration-brand-orange/40 underline-offset-4 hover:text-brand-orange'
                    >
                      {normalizeSeoText(post.title, post.title.length)}
                    </Link>
                  </h3>
                  {post.first_paragraph ? (
                    <p className='break-words text-sm text-foreground/70'>
                      {normalizeSeoText(post.first_paragraph, 220)}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className='rounded-xl border border-dashed p-5 text-foreground/70'>
            No public developer posts match this collection yet. Use the
            learning method above with your own reading, or explore other topics
            on Monkeys.
          </p>
        )}
        <Link
          href='/topics/explore'
          className='inline-flex min-h-11 items-center self-start text-sm text-brand-orange underline'
        >
          Explore all topics
        </Link>
      </section>
    </div>
  );
}
