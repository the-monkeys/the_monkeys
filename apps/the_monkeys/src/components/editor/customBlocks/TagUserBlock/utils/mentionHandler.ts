import { fetcherV2 } from '@/services/fetcher';

/**@ts-ignore */
import '../style.css';
import { MentionUser } from './types';

export default class MentionHandler {
  private static _instance: MentionHandler | null = null;

  private dropdown: HTMLDivElement | null = null;
  private debounceTimer: number | null = null;
  private currentQuery: string = '';
  private users: MentionUser[] = [];
  private activeIndex: number = 0;
  private activeRange: Range | null = null;
  private queryCache: Map<string, MentionUser[]> = new Map();
  private attached: boolean = false;

  static get instance(): MentionHandler {
    if (!MentionHandler._instance) {
      MentionHandler._instance = new MentionHandler();
    }
    return MentionHandler._instance;
  }

  attach(): void {
    if (this.attached) return;
    this.attached = true;

    document.addEventListener('input', this.handleInput);
    document.addEventListener('keydown', this.handleKeyDown, { capture: true });
    document.addEventListener('click', (e: MouseEvent) => {
      if (this.dropdown && !this.dropdown.contains(e.target as Node)) {
        this.closeDropdown();
      }
    });
  }

  private isInsideAnyEditor(target: EventTarget | null): boolean {
    if (!target || !(target as HTMLElement).closest) return false;
    return !!(target as HTMLElement).closest('.codex-editor');
  }

  private handleInput = (e: Event): void => {
    if (!this.isInsideAnyEditor(e.target)) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textContent = range.startContainer.textContent || '';
    const caretPos = range.startOffset;

    const textBeforeCaret = textContent.slice(0, caretPos);
    const match = textBeforeCaret.match(/(?:^|\s)@(\w*)$/);

    if (match) {
      this.currentQuery = match[1];
      this.activeRange = range.cloneRange();

      const rect = range.getBoundingClientRect();
      this.showDropdown(rect);

      if (this.currentQuery.length > 0) {
        this.fetchUsersDebounced(this.currentQuery);
      } else if (this.dropdown) {
        this.renderStatus('Type to search users...');
      }
    } else {
      this.closeDropdown();
    }
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.dropdown) return;
    if (!this.isInsideAnyEditor(e.target)) return;

    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      return;
    }

    if (e.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % (this.users.length || 1);
      this.updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      this.activeIndex =
        (this.activeIndex - 1 + this.users.length) % (this.users.length || 1);
      this.updateActiveItem();
    } else if (e.key === 'Enter') {
      if (this.users.length > 0) {
        this.insertMention(this.users[this.activeIndex]);
      }
    } else if (e.key === 'Escape') {
      this.closeDropdown();
    }
  };

  /** Triggered by the InlineTool's surround() when the toolbar "@" button is clicked. */
  triggerFromRange(range: Range): void {
    const atNode = document.createTextNode('@');
    range.deleteContents();
    range.insertNode(atNode);
    range.setStartAfter(atNode);
    range.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.currentQuery = '';
    this.activeRange = range.cloneRange();

    const rect = range.getBoundingClientRect();
    this.showDropdown(rect);

    if (this.dropdown) {
      this.renderStatus('Type to search users...');
    }
  }

  private fetchUsersDebounced(query: string): void {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);

    if (!query) {
      this.users = [];
      this.renderUsers();
      return;
    }

    if (this.queryCache.has(query)) {
      this.users = this.queryCache.get(query) || [];
      this.activeIndex = 0;
      this.renderUsers();
      return;
    }

    if (this.dropdown) {
      this.renderStatus('Searching...');
    }

    this.debounceTimer = window.setTimeout(async () => {
      try {
        const data = await fetcherV2(
          `user/search?search_term=${encodeURIComponent(query)}&limit=5&offset=0`
        );
        const rawUsers = data?.users || [];

        // Validate all user's profile images at once and set a default if not found
        const fetchedUsers: MentionUser[] = await Promise.all(
          rawUsers.map(async (user: MentionUser) => {
            const targetUrl = `/api/v2/storage/profiles/${user?.username}/profile`;
            let finalAvatarUrl = '/default-profile.svg';

            try {
              const res = await fetch(targetUrl, { method: 'HEAD' });
              if (res.ok) {
                finalAvatarUrl = targetUrl;
              }
            } catch (error) {
              console.warn(
                `Failed to fetch avatar for ${user?.username}`,
                error
              );
            }

            return {
              ...user,
              full_name: [user.first_name, user.last_name]
                .filter(Boolean)
                .join(' ')
                .trim(),
              avatar_url: finalAvatarUrl,
            };
          })
        );

        this.queryCache.set(query, fetchedUsers);
        this.users = fetchedUsers;
        this.activeIndex = 0;

        if (this.dropdown) {
          this.renderUsers();
        }
      } catch (error) {
        if (this.dropdown) {
          this.renderStatus('Error fetching users...', true);
        }
      }
    }, 300);
  }

  private showDropdown(rect: DOMRect): void {
    if (!this.dropdown) {
      this.dropdown = document.createElement('div');
      this.dropdown.className = 'mention-dropdown';

      this.dropdown.addEventListener(
        'mousedown',
        this.handleDropdownInteraction
      );
      this.dropdown.addEventListener(
        'touchstart',
        this.handleDropdownInteraction,
        { passive: false }
      );
      this.dropdown.addEventListener('mouseover', this.handleDropdownHover);

      document.body.appendChild(this.dropdown);
    }

    this.dropdown.style.position = 'absolute';
    this.dropdown.style.top = `${rect.bottom + window.scrollY + 8}px`;
    this.dropdown.style.left = `${rect.left + window.scrollX}px`;
    this.dropdown.style.zIndex = '9999';
  }

  private handleDropdownInteraction = (e: Event): void => {
    const target = e.target as HTMLElement;
    const item = target.closest('.mention-item') as HTMLElement;
    if (!item) return;

    e.preventDefault();
    e.stopPropagation();

    const index = parseInt(item.dataset.index || '0', 10);
    const user = this.users[index];
    if (user) {
      this.insertMention(user);
    }
  };

  private handleDropdownHover = (e: Event): void => {
    const target = e.target as HTMLElement;
    const item = target.closest('.mention-item') as HTMLElement;
    if (!item) return;

    const index = parseInt(item.dataset.index || '0', 10);
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.updateActiveItem();
    }
  };

  private updateActiveItem(): void {
    if (!this.dropdown) return;
    const items = this.dropdown.querySelectorAll('.mention-item');
    items.forEach((item, index) => {
      if (index === this.activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  private renderUsers(): void {
    const dropdown = this.dropdown;
    if (!dropdown) return;

    dropdown.textContent = '';

    if (this.users.length === 0) {
      const status = document.createElement('div');
      status.className = 'mention-status';
      status.textContent = 'No users found';
      dropdown.appendChild(status);
      return;
    }

    const fragment = document.createDocumentFragment();

    this.users.forEach((user, index) => {
      const item = document.createElement('div');
      item.className = `mention-item ${index === this.activeIndex ? 'active' : ''}`;

      const img = document.createElement('img');
      img.src = user?.avatar_url || '';
      img.className = 'mention-avatar';
      img.alt = user?.username;

      const infoContainer = document.createElement('div');
      infoContainer.className = 'mention-user-info';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'mention-name';
      nameSpan.textContent = user?.full_name || '';

      const usernameSpan = document.createElement('span');
      usernameSpan.className = 'mention-username';
      usernameSpan.textContent = `@${user?.username}`;

      infoContainer.appendChild(nameSpan);
      infoContainer.appendChild(usernameSpan);

      item.appendChild(img);
      item.appendChild(infoContainer);

      item.dataset.index = index.toString();

      fragment.appendChild(item);
    });

    dropdown.appendChild(fragment);
  }

  private insertMention(user: MentionUser): void {
    if (!this.activeRange) return;

    const selection = window.getSelection();
    if (!selection) return;

    const mentionNode = document.createElement('a');
    mentionNode.href = `/${user.username}`;
    mentionNode.className = 'mention-tag';
    mentionNode.dataset.username = user.username;
    mentionNode.dataset.id = user.id;
    mentionNode.contentEditable = 'false';

    const avatarSpan = document.createElement('span');
    avatarSpan.className = 'mention-card-avatar';

    const avatarImg = document.createElement('img');
    avatarImg.src = user?.avatar_url || '';
    avatarImg.alt = user?.username;
    avatarSpan.appendChild(avatarImg);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'mention-card-fullname';
    nameSpan.textContent = user?.full_name || '';

    mentionNode.appendChild(avatarSpan);
    mentionNode.appendChild(nameSpan);

    const textNode = this.activeRange.startContainer;
    const textContent = textNode.textContent || '';
    const atIndex = textContent.lastIndexOf('@', this.activeRange.startOffset);

    if (atIndex !== -1) {
      this.activeRange.setStart(textNode, atIndex);
      this.activeRange.deleteContents();
      this.activeRange.insertNode(mentionNode);

      const spaceNode = document.createTextNode('\u00A0');
      mentionNode.parentNode?.insertBefore(spaceNode, mentionNode.nextSibling);

      this.activeRange.setStartAfter(spaceNode);
      this.activeRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(this.activeRange);
    }

    this.closeDropdown();
  }

  private renderStatus(message: string, isError: boolean = false): void {
    if (!this.dropdown) return;

    this.dropdown.textContent = '';

    const statusDiv = document.createElement('div');
    statusDiv.className = isError ? 'mention-status error' : 'mention-status';
    statusDiv.textContent = message;

    this.dropdown.appendChild(statusDiv);
  }

  private closeDropdown(): void {
    if (this.dropdown) {
      this.dropdown.removeEventListener(
        'mousedown',
        this.handleDropdownInteraction
      );
      this.dropdown.removeEventListener(
        'touchstart',
        this.handleDropdownInteraction
      );
      this.dropdown.removeEventListener('mouseover', this.handleDropdownHover);

      this.dropdown.remove();
      this.dropdown = null;
    }
    this.currentQuery = '';
    this.activeRange = null;
    this.users = [];
  }
}
