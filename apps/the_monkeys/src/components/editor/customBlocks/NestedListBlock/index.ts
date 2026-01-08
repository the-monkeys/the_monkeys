import { API, BlockTool, ToolboxConfig } from '@editorjs/editorjs';

import './style.css';
import { ConstructorArgs, ListItemData, ListToolData } from './utils/interface';

export default class NestedList implements BlockTool {
  private api: API;
  private data: ListToolData;
  private readOnly: boolean;
  private wrapper!: HTMLElement;
  private maxLevel: number = 3;
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * We bind this method in the constructor or use an arrow function
   * so we can pass the exact same reference to removeEventListener.
   */
  private readonly onKeyDown: (event: KeyboardEvent) => void;

  constructor({ data, api, readOnly }: ConstructorArgs) {
    this.api = api;
    this.readOnly = !!readOnly;

    this.onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') this.handleEnter(event);
      else if (event.key === 'Backspace') this.handleBackspace(event);
      else if (event.key === 'Tab') this.handleTab(event);
    };

    // Data Normalization:
    // Ensures we always work with the ListItemData[] structure,
    // even if legacy data (strings) is passed.
    const incomingItems =
      data && data.items && data.items.length > 0 ? data.items : [];

    const normalizedItems: ListItemData[] = (incomingItems as any[]).map(
      (item) => {
        if (typeof item === 'string') {
          return { content: item, items: [] };
        }
        return {
          content: item.content,
          items: item.items || [],
        };
      }
    );

    // Ensure the block is never completely empty on initialization
    if (normalizedItems.length === 0) {
      normalizedItems.push({ content: '', items: [] });
    }

    this.data = {
      style: data && data.style ? data.style : 'unordered',
      items: normalizedItems,
    };
  }

  /**
   * Returns the toolbox configuration.
   * Allows users to create either a Bullet or Numbered list directly.
   */
  static get toolbox(): ToolboxConfig {
    return [
      {
        title: 'Bullet List',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 6h2v2H4zM8 6h12v2H8zM4 11h2v2H4zM8 11h12v2H8zM4 16h2v2H4zM8 16h12v2H8z"/></svg>',
        data: { style: 'unordered' },
      },
      {
        title: 'Numbered List',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>',
        data: { style: 'ordered' },
      },
    ];
  }

  /**
   * Allows toggling between Ordered and Unordered lists dynamically.
   */
  renderSettings() {
    return [
      {
        name: 'unordered',
        label: 'Unordered',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6h11v2H9zM4 6h2v2H4zM9 11h11v2H9zM4 11h2v2H4zM9 16h11v2H9zM4 16h2v2H4z" fill="currentColor"/></svg>',
        closeOnActivate: true,
        isActive: this.data.style === 'unordered',
        onActivate: () => this.toggleTune('unordered'),
      },
      {
        name: 'ordered',
        label: 'Ordered',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10 6h10v2H10zM4 6h3v2H4zM10 11h10v2H10zM4 11h3v2H4zM10 16h10v2H10zM4 16h3v2H4z" fill="currentColor"/></svg>',
        closeOnActivate: true,
        isActive: this.data.style === 'ordered',
        onActivate: () => this.toggleTune('ordered'),
      },
    ];
  }

  /**
   * Switches the list style (UL <-> OL).
   */
  private toggleTune(style: 'ordered' | 'unordered') {
    if (this.data.style === style) return;

    this.data.style = style;
    const newTag = style === 'ordered' ? 'ol' : 'ul';
    const newWrapper = document.createElement(newTag);
    newWrapper.className = 'cdx-list';

    // Move existing children to the new wrapper
    while (this.wrapper.firstChild) {
      newWrapper.appendChild(this.wrapper.firstChild);
    }

    // Cleanup old events
    if (this.wrapper) {
      this.wrapper.removeEventListener('keydown', this.onKeyDown);
    }

    this.wrapper.parentNode?.replaceChild(newWrapper, this.wrapper);
    this.wrapper = newWrapper;

    // Attach events to new wrapper
    if (!this.readOnly) {
      this.wrapper.addEventListener('keydown', this.onKeyDown);
    }

    // update nested lists to match the style
    this.updateSublistsStyles(this.wrapper, newTag);
  }

  private updateSublistsStyles(parent: HTMLElement, newTag: string) {
    const sublists = parent.querySelectorAll('.cdx-list__sublist');
    sublists.forEach((oldSublist) => {
      const newSublist = document.createElement(newTag);
      newSublist.className = 'cdx-list__sublist';
      while (oldSublist.firstChild) {
        newSublist.appendChild(oldSublist.firstChild);
      }
      oldSublist.parentNode?.replaceChild(newSublist, oldSublist);
    });
  }

  /**
   * Main render method. Creates the DOM structure.
   */
  render(): HTMLElement {
    this.wrapper = document.createElement(
      this.data.style === 'ordered' ? 'ol' : 'ul'
    );
    this.wrapper.className = 'cdx-list';

    this.data.items.forEach((item) => {
      if (typeof item === 'string') {
        this.wrapper.appendChild(this.createListItem(item));
      } else {
        this.wrapper.appendChild(this.renderItem(item));
      }
    });

    if (!this.readOnly) {
      this.wrapper.addEventListener('keydown', this.onKeyDown);
    }

    return this.wrapper;
  }

  /**
   * Editor.js Lifecycle Method.
   * Cleans up event listeners when the block is removed to prevent memory leaks.
   */
  destroy() {
    if (this.wrapper) {
      this.wrapper.removeEventListener('keydown', this.onKeyDown);
    }
  }

  /**
   * Saves the block content.
   * Returns 'any' to satisfy the generic BlockTool interface.
   */
  save(root: HTMLElement): any {
    const items = this.readItems(root);
    return {
      style: root.tagName === 'OL' ? 'ordered' : 'unordered',
      items: items,
    };
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

  /**
   * Calculates nesting depth.
   */
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
    const sublist = currentItem.querySelector('.cdx-list__sublist');

    // If item has children, prepend new item to children. Otherwise, append sibling.
    if (sublist) {
      sublist.insertBefore(newItem, sublist.firstChild);
    } else {
      if (currentItem.nextSibling) {
        currentItem.parentNode?.insertBefore(newItem, currentItem.nextSibling);
      } else {
        currentItem.parentNode?.appendChild(newItem);
      }
    }

    this.focusItem(newItem);
  }

  /**
   * Backspace Logic:
   * 1. Outdent if nested.
   * 2. Merge with previous item if at root level.
   * 3. Convert to Paragraph if list is empty.
   */
  private handleBackspace(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    const selection = window.getSelection();
    // Only act if cursor is at the very beginning of the item
    if (selection && selection.anchorOffset !== 0) return;

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;
    const parent = currentItem.parentElement as HTMLElement;
    const previousItem = currentItem.previousElementSibling as HTMLElement;

    // Case 1: Outdent (Level 2/3 -> Parent)
    if (parent.classList.contains('cdx-list__sublist')) {
      event.preventDefault();
      event.stopPropagation();
      this.outdentItem(currentItem);
      return;
    }

    // Case 2: Merge with Previous Item (Level 1)
    if (previousItem) {
      event.preventDefault();
      event.stopPropagation();

      const previousContent = previousItem.querySelector(
        '.cdx-list__item-content'
      ) as HTMLElement;
      const currentHTML = target.innerHTML;

      // Merge text: Append current text to previous item
      if (currentHTML !== '' && currentHTML !== '<br>') {
        previousContent.innerHTML += currentHTML;
      }

      // Merge children: Move sublists from current to previous
      const currentSublist = currentItem.querySelector('.cdx-list__sublist');
      if (currentSublist) {
        const previousSublist =
          previousItem.querySelector('.cdx-list__sublist');
        if (!previousSublist) {
          previousItem.appendChild(currentSublist);
        } else {
          while (currentSublist.firstChild) {
            previousSublist.appendChild(currentSublist.firstChild);
          }
        }
      }

      currentItem.remove();
      // Set focus to the end of the previous item (where text was merged)
      this.focusItem(previousItem, true);
    } else {
      // Case 3: Empty First Item -> Convert to Paragraph
      if (target.innerHTML.trim() === '' || target.innerHTML === '<br>') {
        event.preventDefault();

        const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

        // Replace list block with a new Paragraph block
        this.api.blocks.insert(
          'paragraph',
          { text: '' },
          {},
          currentBlockIndex,
          true
        );
        this.api.blocks.delete(currentBlockIndex + 1);

        // Delay to allow DOM update before setting caret
        setTimeout(() => {
          this.api.caret.setToBlock(currentBlockIndex);
        }, 10);
      }
    }
  }

  private handleTab(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    event.preventDefault();
    event.stopPropagation();

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;

    // Shift+Tab: Outdent
    if (event.shiftKey) {
      this.outdentItem(currentItem);
      return;
    }

    // Tab: Indent (if max level not reached)
    const currentLevel = this.getLevel(currentItem);
    if (currentLevel >= this.maxLevel) {
      return;
    }

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

  private outdentItem(item: HTMLElement) {
    const parent = item.parentElement as HTMLElement;

    if (parent.classList.contains('cdx-list__sublist')) {
      const parentLi = parent.parentElement as HTMLElement;
      const grandParent = parentLi.parentElement as HTMLElement;

      if (parentLi.nextSibling) {
        grandParent.insertBefore(item, parentLi.nextSibling);
      } else {
        grandParent.appendChild(item);
      }

      if (parent.children.length === 0) {
        parent.remove();
      }

      this.focusItem(item);
    }
  }

  private focusItem(item: HTMLElement, atEnd: boolean = false) {
    const content = item.querySelector(
      '.cdx-list__item-content'
    ) as HTMLElement;
    if (content) {
      content.focus();
      if (
        typeof window.getSelection !== 'undefined' &&
        typeof document.createRange !== 'undefined'
      ) {
        const range = document.createRange();
        range.selectNodeContents(content);

        // range.collapse(false) collapses the range to the END of the content.
        // range.collapse(true) collapses to the START.
        range.collapse(!atEnd);

        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
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

  static get enableLineBreaks() {
    return true;
  }
}
