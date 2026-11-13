import { describe, expect, it } from 'vitest';

import { toPostSnapshot } from './adapters';
import { analyseReadiness } from './analyse';

describe('bounded readiness processing', () => {
  it('measures local processing for a 10,000-word draft and the configured maximum', () => {
    const context = {
      resourceKey: 'performance-fixture',
      accountKey: 'local-test',
      revision: 1,
      audience: 'public',
      topics: ['Community'],
      authorName: 'Local tester',
    };
    const normal = {
      blocks: [
        { type: 'header', data: { text: 'Local benchmark', level: 1 } },
        { type: 'paragraph', data: { text: 'community '.repeat(10000) } },
      ],
    };
    const maximum = {
      blocks: Array.from({ length: 2000 }, (_, i) => ({
        type: i === 0 ? 'header' : 'paragraph',
        data: { text: 'community '.repeat(11), level: i === 0 ? 1 : undefined },
      })),
    };
    const times: Record<string, number[]> = {};
    for (const [name, document] of [
      ['10000-words', normal],
      ['bounded-maximum', maximum],
      [
        'malformed-markup',
        {
          blocks: [{ type: 'paragraph', data: { text: '<a '.repeat(20000) } }],
        },
      ],
      [
        'oversized-list',
        {
          blocks: [
            {
              type: 'list',
              data: {
                style: 'unordered',
                items: Array.from({ length: 2000 }, () => 'x'.repeat(20000)),
              },
            },
          ],
        },
      ],
    ] as const) {
      const originalLength = document.blocks.length;
      times[name] = [];
      for (let iteration = 0; iteration < 5; iteration++) {
        const start = performance.now();
        const snapshot = toPostSnapshot(document, context);
        const report = analyseReadiness(snapshot);
        times[name].push(Number((performance.now() - start).toFixed(2)));
        expect(snapshot.bodyText.length).toBeLessThanOrEqual(200000);
        expect(report.rulesVersion).toBe('creator-event-v1');
        expect(document.blocks).toHaveLength(originalLength);
      }
    }
    console.info(
      'Readiness local processing milliseconds:',
      JSON.stringify(times)
    );
  });
});
