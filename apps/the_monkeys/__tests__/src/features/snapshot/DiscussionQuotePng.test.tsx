// @vitest-environment node
import {
  type FunctionComponent,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from 'react';

import { quoteCard } from '@/features/snapshot/templates/QuoteCard';
import { DEFAULT_THEME_ID, getThemeById } from '@/features/snapshot/themes';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { expect, it } from 'vitest';

function resolveTree(node: ReactNode): unknown {
  if (Array.isArray(node)) return node.map(resolveTree);
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (typeof element.type === 'function')
    return resolveTree(
      (element.type as FunctionComponent<{ children?: ReactNode }>)(
        element.props
      )
    );
  if (typeof element.type !== 'string')
    throw new Error('Expected a snapshot primitive');
  return {
    type: element.type,
    props: { ...element.props, children: resolveTree(element.props.children) },
  };
}

const sample =
  "Digital transformation isn't just about upgrading software. It's rethinking how your business operates, innovates, and delivers value using AI, cloud, and data. True change starts with adopting tech into work culture. #DigitalTransformation";
const cases = [
  { name: 'short', text: 'Hi' },
  {
    name: '250-characters',
    text: 'A useful discussion about technology and community. '
      .repeat(5)
      .slice(0, 250),
  },
  {
    name: '500-characters',
    text: 'A useful discussion about technology and community. '
      .repeat(10)
      .slice(0, 500),
  },
  { name: '500-wide-characters', text: 'W'.repeat(500) },
  { name: 'long-hashtag', text: '#' + 'DigitalTransformation'.repeat(23) },
  { name: 'example', text: sample },
  { name: 'long-handle', text: 'W'.repeat(500) },
  {
    name: 'mixed-tokens',
    text: ('W'.repeat(80) + ' a'.repeat(10) + ' ').repeat(5).slice(0, 500),
  },
  {
    name: 'mixed-tokens-long-handle',
    text: ('W'.repeat(80) + ' a'.repeat(10) + ' ').repeat(5).slice(0, 500),
  },
];
it.each(
  cases.flatMap((testCase) =>
    [
      { width: 1080, height: 1080, padding: 80 },
      { width: 1200, height: 630, padding: 48 },
    ].map((size) => ({ ...size, ...testCase }))
  )
)(
  'keeps $name inside the real PNG canvas: $width x $height',
  async (size) => {
    const Render = quoteCard.Render;
    const tree = resolveTree(
      <Render
        input={{
          source: 'discussion',
          title: 'Discussion',
          quote: size.text,
          author: {
            username: size.name.endsWith('long-handle')
              ? 'W'.repeat(50)
              : 'buddhicintaka',
            displayName: 'Buddhicintaka',
            isVerified: true,
          },
          sourceUrl: 'http://127.0.0.1:3000/discussions/local-test',
        }}
        theme={getThemeById(DEFAULT_THEME_ID)}
        accent='#FF5542'
        renderSize={size}
        assetUrls={{
          logo:
            'data:image/svg+xml,' +
            encodeURIComponent(readFileSync('public/logo-brand.svg', 'utf8')),
          verifiedBadge:
            'data:image/svg+xml,' +
            encodeURIComponent(
              readFileSync('public/snapshot-verified.svg', 'utf8')
            ),
        }}
      />
    );
    // Isolate the native renderer from Vitest's VM and normalize this Next version's
    // POSIX-only bundled asset joins in memory. Installed packages remain unchanged.
    const code = String.raw`
const {readFileSync}=require('node:fs');
const {createElement}=require('react');
const path=require('node:path');
function revive(n){if(Array.isArray(n))return n.map(revive);if(n&&typeof n==='object')return createElement(n.type,{...n.props,children:revive(n.props.children)});return n;}
async function run(){const modulePath=require.resolve('next/dist/compiled/@vercel/og');let source=readFileSync(modulePath,'utf8');source=source.replace(/fileURLToPath\(join\(import\.meta\.url, \"\.\.\/([^\"]+)\"\)\)/g,(_,asset)=>JSON.stringify(path.join(path.dirname(modulePath),asset)));const {ImageResponse}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));const {size,tree}=JSON.parse(readFileSync(0,'utf8'));const response=new ImageResponse(revive(tree),{...size,fonts:[400,600].map(weight=>({name:'DM Sans',data:readFileSync('public/fonts/dm-sans-'+weight+'.ttf'),weight,style:'normal'}))});process.stdout.write(Buffer.from(await response.arrayBuffer()));}
run().catch(e=>{console.error(e);process.exit(1)});`;
    const png = execFileSync(process.execPath, ['-e', code], {
      input: JSON.stringify({ tree, size }),
      cwd: process.cwd(),
      maxBuffer: 8 * 1024 * 1024,
      timeout: 15000,
    });
    if (process.env.MONKEYS_SNAP_EVIDENCE_DIR) {
      mkdirSync(process.env.MONKEYS_SNAP_EVIDENCE_DIR, { recursive: true });
      writeFileSync(
        join(
          process.env.MONKEYS_SNAP_EVIDENCE_DIR,
          `${size.name}-${size.width}.png`
        ),
        png
      );
    }
    const { data, info } = await sharp(png)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(info.width).toBe(size.width);
    expect(info.height).toBe(size.height);
    let clippedPixels = 0;
    for (let y = 0; y < info.height; y++)
      for (let x = info.width - size.padding + 4; x < info.width; x++) {
        const i = (y * info.width + x) * info.channels;
        if (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235)
          clippedPixels++;
      }
    expect(clippedPixels).toBe(0);
    let bottomPixels = 0;
    for (let y = info.height - size.padding + 4; y < info.height; y++)
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * info.channels;
        if (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235)
          bottomPixels++;
      }
    expect(bottomPixels).toBe(0);
  },
  20000
);
