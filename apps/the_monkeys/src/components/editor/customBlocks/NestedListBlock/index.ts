import { API, BlockTool } from '@editorjs/editorjs';

import './style.css';
import {
  ConstructorArgs,
  ListData,
  ListItemData,
  ListToolData,
} from './utils/interface';

// Ensure you import the CSS if you are using a bundler!

export default class NestedList implements BlockTool {
  private api: API;
  private data: ListToolData;
  private readOnly: boolean;
  private wrapper!: HTMLElement;
  private maxLevel: number = 3;

  constructor({ data, api, readOnly }: ConstructorArgs) {
    this.api = api;
    this.readOnly = !!readOnly;
    this.data = data || {
      style: 'unordered',
      items: [{ content: '', items: [] }],
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement(
      this.data.style === 'ordered' ? 'ol' : 'ul'
    );
    this.wrapper.className = 'cdx-list';

    if (!this.data.items || this.data.items.length === 0) {
      this.data.items = [{ content: '', items: [] }];
    }

    this.data.items.forEach((item) => {
      if (typeof item === 'string') {
        this.wrapper.appendChild(this.createListItem(item));
      } else {
        this.wrapper.appendChild(this.renderItem(item));
      }
    });

    if (!this.readOnly) {
      this.wrapper.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.handleEnter(event);
        } else if (event.key === 'Backspace') {
          this.handleBackspace(event);
        } else if (event.key === 'Tab') {
          this.handleTab(event);
        }
      });
    }

    return this.wrapper;
  }

  private createListItem(contentHTML: string = ''): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'cdx-list__item';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'cdx-list__item-content';
    contentDiv.contentEditable = String(!this.readOnly);
    contentDiv.innerHTML = contentHTML;

    li.appendChild(contentDiv);
    return li;
  }

  private renderItem(item: ListItemData): HTMLLIElement {
    const li = this.createListItem(item.content);

    if (item.items && item.items.length > 0) {
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

  private getLevel(element: HTMLElement): number {
    let level = 1;
    let parent = element.parentElement;

    while (parent && parent !== this.wrapper) {
      if (parent.classList.contains('cdx-list__sublist')) {
        level++;
      }
      parent = parent.parentElement;
    }

    return level;
  }

  private handleEnter(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    event.preventDefault();
    event.stopPropagation();

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;
    const newItem = this.createListItem('');

    // Logic to insert after current item or inside sublist
    const sublist = currentItem.querySelector('.cdx-list__sublist');

    if (sublist) {
      // If the item I pressed enter on has children, prepend the new item to those children
      sublist.insertBefore(newItem, sublist.firstChild);
    } else {
      // Otherwise just add it after the current item
      if (currentItem.nextSibling) {
        currentItem.parentNode?.insertBefore(newItem, currentItem.nextSibling);
      } else {
        currentItem.parentNode?.appendChild(newItem);
      }
    }

    this.focusItem(newItem);
  }

  private handleBackspace(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    const selection = window.getSelection();
    // Only proceed if cursor is at the start (offset 0)
    if (selection && selection.anchorOffset !== 0) return;

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;
    const previousItem = currentItem.previousElementSibling as HTMLElement;
    const parent = currentItem.parentElement as HTMLElement;

    // Logic 1: Un-indent (if inside a sublist and no previous sibling)
    if (!previousItem && parent.classList.contains('cdx-list__sublist')) {
      event.preventDefault();
      const parentLi = parent.parentElement as HTMLElement;
      const grandParent = parentLi.parentElement as HTMLElement;

      grandParent.insertBefore(currentItem, parentLi.nextSibling);

      if (parent.children.length === 0) parent.remove();
      this.focusItem(currentItem);
      return;
    }

    // Logic 2: Merge/Delete
    if (previousItem) {
      // If empty, just delete
      if (target.innerHTML.trim() === '' || target.innerHTML === '<br>') {
        event.preventDefault();
        currentItem.remove();
        this.focusItem(previousItem);
      }
    } else if (
      !previousItem &&
      !parent.classList.contains('cdx-list__sublist')
    ) {
      // First item of the main list - do nothing or handle block merge (advanced)
    }
  }

  private handleTab(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    event.preventDefault();
    event.stopPropagation();

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;

    // Shift+Tab: Un-indent
    if (event.shiftKey) {
      const parent = currentItem.parentElement as HTMLElement;

      if (parent.classList.contains('cdx-list__sublist')) {
        const parentLi = parent.parentElement as HTMLElement;
        const grandParent = parentLi.parentElement as HTMLElement;
        grandParent.insertBefore(currentItem, parentLi.nextSibling);
        if (parent.children.length === 0) parent.remove();
        this.focusItem(currentItem);
      }

      return;
    }

    // Tab: Indent
    const previousItem = currentItem.previousElementSibling as HTMLElement;
    if (previousItem) {
      let sublist = previousItem.querySelector('.cdx-list__sublist');
      if (!sublist) {
        sublist = document.createElement(
          this.data.style === 'ordered' ? 'ol' : 'ul'
        );
        sublist.className = 'cdx-list__sublist';
        previousItem.appendChild(sublist);
      }
      sublist.appendChild(currentItem);
      this.focusItem(currentItem);
    }
  }

  private focusItem(item: HTMLElement) {
    const content = item.querySelector(
      '.cdx-list__item-content'
    ) as HTMLElement;
    if (content) {
      content.focus();
      // Move cursor to end
      if (
        typeof window.getSelection !== 'undefined' &&
        typeof document.createRange !== 'undefined'
      ) {
        const range = document.createRange();
        range.selectNodeContents(content);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  save(root: HTMLElement): ListData {
    const items = this.readItems(root);
    return {
      style: root.tagName === 'OL' ? 'ordered' : 'unordered',
      items: items,
    };
  }

  private readItems(list: HTMLElement): ListItemData[] {
    const items: ListItemData[] = [];
    const distinctItems = Array.from(list.children).filter(
      (el) => el.tagName === 'LI'
    );

    distinctItems.forEach((li) => {
      const contentEl = li.querySelector(':scope > .cdx-list__item-content');
      const sublist = li.querySelector(':scope > .cdx-list__sublist');

      items.push({
        content: contentEl ? contentEl.innerHTML : '',
        items: sublist ? this.readItems(sublist as HTMLElement) : [],
      });
    });

    return items;
  }

  static get toolbox() {
    return {
      title: 'List',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 6h2v2H4zM8 6h12v2H8zM4 11h2v2H4zM8 11h12v2H8zM4 16h2v2H4zM8 16h12v2H8z"/></svg>',
    };
  }

  static get enableLineBreaks() {
    return true;
  }
}
