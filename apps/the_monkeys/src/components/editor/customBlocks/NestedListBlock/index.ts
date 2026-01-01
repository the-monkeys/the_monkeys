import { API, BlockTool } from '@editorjs/editorjs';

import {
  ConstructorArgs,
  ListData,
  ListItemData,
  ListToolData,
} from './utils/interface';

export default class NestedList {
  private api: API;
  private data: ListToolData;
  private readOnly: boolean;
  private wrapper!: HTMLElement;

  constructor({ data, api, readOnly }: ConstructorArgs) {
    this.api = api;
    this.readOnly = !!readOnly;

    this.data = data ?? {
      style: 'unordered',
      items: [{ content: '', items: [] }],
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement(
      this.data.style === 'ordered' ? 'ol' : 'ul'
    );
    this.wrapper.className = 'cdx-list';

    this.data.items?.forEach((item) => {
      this.wrapper.appendChild(this.renderItem(item));
    });

    return this.wrapper;
  }

  static get toolbox() {
    return {
      title: 'List',
      icon: `
                <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M4 6h2v2H4zM8 6h12v2H8zM4 11h2v2H4zM8 11h12v2H8zM4 16h2v2H4zM8 16h12v2H8z"/>
                </svg>
            `,
    };
  }

  static get sanitize() {
    return {
      items: {
        content: true,
      },
    };
  }

  private renderItem(item: ListItemData): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'cdx-list__item';

    const content = document.createElement('div');
    content.className = 'cdx-list__item-content';
    content.contentEditable = String(!this.readOnly);
    content.innerHTML = item.content || '';

    li.appendChild(content);

    // Nested list
    if (item.items?.length) {
      const sublist = document.createElement(
        this.data.style === 'ordered' ? 'ol' : 'ul'
      );
      sublist.className = 'cdx-list__sublist';

      item.items.forEach((subItem) => {
        sublist.appendChild(this.renderItem(subItem));
      });

      li.appendChild(sublist);
    }

    return li;
  }

  save(root: HTMLElement): ListData {
    const items = this.readItems(root);
    // Ensure readItems returns valid ListData; add type guard if needed
    if (!items || typeof items !== 'object' || Array.isArray(items)) {
      throw new Error('Invalid items data');
    }

    return {
      style: root.tagName === 'OL' ? 'ordered' : 'unordered',
      items: items,
    };
  }

  private readItems(list: HTMLElement): ListItemData[] {
    const items: ListItemData[] = [];

    list.querySelectorAll(':scope > li').forEach((li) => {
      const content = li.querySelector(
        ':scope > .cdx-list__item-content'
      ) as HTMLElement | null;

      const sublist = li.querySelector(
        ':scope > ul, :scope > ol'
      ) as HTMLElement | null;

      items.push({
        content: content?.innerHTML || '',
        items: sublist ? this.readItems(sublist) : [],
      });
    });

    return items;
  }
}
