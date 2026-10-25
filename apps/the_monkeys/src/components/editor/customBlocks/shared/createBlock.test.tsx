import { act, cleanup } from '@testing-library/react';
import type { API } from '@themonkeys/monkeys-editor';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createBlock } from './createBlock';

afterEach(cleanup);

function Boom(): never {
  throw new Error('block explode');
}

describe('createBlock', () => {
  it('does not take down the page when the block component throws', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Tool = createBlock({
      toolbox: { title: 'Boom', icon: 'x' },
      defaultData: {},
      sanitize: {},
      Component: Boom,
    });
    // The throwing block never calls the editor API in this boundary test.
    const tool = new Tool({ data: {}, api: {} as API, readOnly: false });
    const el = tool.render();
    await act(async () => {});
    expect(el.textContent).toMatch(/could not be rendered/i);
    spy.mockRestore();
  });
});
