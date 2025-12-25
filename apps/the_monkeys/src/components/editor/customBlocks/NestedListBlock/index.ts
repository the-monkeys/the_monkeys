import { API, BlockTool } from '@editorjs/editorjs';

import {
  ConstructorData,
  LegacyListData,
  ListConfig,
  ListData,
  ListNode,
} from './utils/interface';

export default class CustomList implements BlockTool {
  private api: API;
  private readOnly: boolean;
  private config: ListConfig;
  private data: ListData;
  private nodes: {
    wrapper: HTMLElement | null;
  };

  constructor({ api, data, config, readOnly }: ConstructorData) {
    this.api = api;
    this.readOnly = readOnly === true;
    this.config = {
      defaultStyle: 'unordered',
      maxLevel: 3, // Max indent limit
      ...config,
    };

    // BACKWARD COMPATIBILITY & DATA NORMALIZATION
    this.data = this.normalizeData(data);
    this.nodes = { wrapper: null };
  }

  /**
   * Converts old string[] data to new ListNode[] format safely
   */
  private normalizeData(data: ListData | LegacyListData | undefined): ListData {
    const defaultData: ListData = {
      style: data?.style || this.config.defaultStyle || 'unordered',
      items: [],
    };

    if (!data || !data.items) {
      return defaultData;
    }

    // Handle Legacy (official plugin) data format
    if (data.items.length > 0 && typeof data.items[0] === 'string') {
      const legacyItems = data.items as string[];
      return {
        style: defaultData.style,
        items: legacyItems.map((text) => ({ content: text, items: [] })),
      };
    }

    // It is already in the new format
    return data as ListData;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox() {
    return {
      icon: '<svg width="13" height="11" viewBox="0 0 17 13"><path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.7h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.7a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      title: 'List',
    };
  }

  render(): HTMLElement {
    const tag = this.data.style === 'ordered' ? 'ol' : 'ul';
    this.nodes.wrapper = document.createElement(tag);
    this.nodes.wrapper.classList.add('cdx-block', 'cdx-list');

    // If empty, start with one empty item
    if (this.data.items.length === 0) {
      this.nodes.wrapper.appendChild(
        this.createItemElement({ content: '', items: [] })
      );
    } else {
      this.data.items.forEach((item) => {
        this.nodes.wrapper?.appendChild(this.createItemElement(item));
      });
    }

    if (!this.readOnly) {
      this.nodes.wrapper.addEventListener('keydown', (event) =>
        this.onKeyDown(event)
      );
    }

    return this.nodes.wrapper;
  }

  private createItemElement(node: ListNode): HTMLElement {
    const item = document.createElement('li');
    item.classList.add('cdx-list__item');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cdx-list__item-content');
    contentDiv.contentEditable = 'true';
    contentDiv.innerHTML = node.content;
    item.appendChild(contentDiv);

    if (node.items && node.items.length > 0) {
      const subList = document.createElement(
        this.data.style === 'ordered' ? 'ol' : 'ul'
      );
      subList.classList.add('cdx-list__sublist');
      node.items.forEach((subItem) => {
        subList.appendChild(this.createItemElement(subItem));
      });
      item.appendChild(subList);
    }

    return item;
  }

  save(blockContent: HTMLElement): ListData {
    const getItems = (parent: HTMLElement): ListNode[] => {
      // Filter only direct children LI elements
      const nodes = Array.from(parent.children).filter(
        (el) => el.tagName === 'LI'
      );

      return nodes.map((li) => {
        const contentEl = li.querySelector(':scope > .cdx-list__item-content');
        const subList = li.querySelector(':scope > ul, :scope > ol'); // Use :scope to ensure direct child

        return {
          content: contentEl ? contentEl.innerHTML : '',
          items: subList ? getItems(subList as HTMLElement) : [],
        };
      });
    };

    return {
      style: this.data.style,
      items: getItems(blockContent),
    };
  }

  /**
   * Event Handling
   */
  private onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    const listItem = target.closest('li');
    if (!listItem) return;

    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        this.outdent(listItem);
      } else {
        this.indent(listItem);
      }
    } else if (event.key === 'Enter') {
      this.handleEnter(event, listItem);
    } else if (event.key === 'Backspace' && target.innerHTML === '') {
      this.handleBackspace(event, listItem);
    }
  }

  /**
   * Helper: Calculate Nesting Depth
   * Returns 1 for top level, 2 for first nested, etc.
   */
  private getItemDepth(item: HTMLElement): number {
    let depth = 1;
    let parent = item.parentElement;

    // Climb up until we hit the main wrapper or run out of parents
    while (parent && parent !== this.nodes.wrapper) {
      if (parent.tagName === 'UL' || parent.tagName === 'OL') {
        depth++;
      }
      parent = parent.parentElement;
    }
    return depth;
  }

  private indent(item: HTMLLIElement) {
    const prevSibling = item.previousElementSibling;
    // Cannot indent if no previous sibling
    if (!prevSibling) return;

    // 2. DEPTH LIMIT CHECK
    const currentDepth = this.getItemDepth(item);
    if (currentDepth >= (this.config.maxLevel || 3)) {
      // Logic: If we are at max level, we simply stop here.
      // Optional: Add a small shake animation or visual cue.
      return;
    }

    let subList = prevSibling.querySelector('ul, ol');
    if (!subList) {
      subList = document.createElement(
        this.data.style === 'ordered' ? 'ol' : 'ul'
      );
      subList.classList.add('cdx-list__sublist');
      prevSibling.appendChild(subList);
    }

    subList.appendChild(item);
    this.focusItem(item);
  }

  private outdent(item: HTMLLIElement) {
    const parentList = item.parentElement;
    // If parent is the main wrapper, we can't outdent further
    if (parentList === this.nodes.wrapper) return;

    const parentItem = parentList?.closest('li');
    if (!parentItem) return;

    parentItem.after(item);

    if (parentList && parentList.children.length === 0) {
      parentList.remove();
    }
    this.focusItem(item);
  }

  private handleEnter(event: KeyboardEvent, item: HTMLLIElement) {
    event.preventDefault();
    const newItem = this.createItemElement({ content: '', items: [] });

    // Insert after the current item
    if (item.nextSibling) {
      item.parentNode?.insertBefore(newItem, item.nextSibling);
    } else {
      item.parentNode?.appendChild(newItem);
    }

    this.focusItem(newItem);
  }

  private handleBackspace(event: KeyboardEvent, item: HTMLLIElement) {
    const prev = item.previousElementSibling as HTMLLIElement;

    // If nested and empty, outdent on backspace (UX standard)
    const currentDepth = this.getItemDepth(item);
    if (currentDepth > 1) {
      event.preventDefault();
      this.outdent(item);
      return;
    }

    // Standard delete behavior
    if (prev) {
      event.preventDefault();
      item.remove();
      const prevContent = prev.querySelector(
        '.cdx-list__item-content'
      ) as HTMLElement;
      if (prevContent) {
        // Move cursor to end of previous item
        prevContent.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(prevContent);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  private focusItem(item: HTMLElement) {
    const content = item.querySelector(
      '.cdx-list__item-content'
    ) as HTMLElement;
    if (content) {
      content.focus();
    }
  }
}
