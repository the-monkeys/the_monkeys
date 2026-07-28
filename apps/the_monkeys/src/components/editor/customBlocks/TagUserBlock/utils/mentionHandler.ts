import { fetcherV2 } from '@/services/fetcher';

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
    document.addEventListener('click', this.handleDocumentClick);

    window.addEventListener('resize', this.updateDropdownPosition);
    window.addEventListener('scroll', this.updateDropdownPosition, {
      capture: true,
      passive: true,
    });
  }

  detach(): void {
    if (!this.attached) return;
    this.attached = false;

    document.removeEventListener('input', this.handleInput);
    document.removeEventListener('keydown', this.handleKeyDown, {
      capture: true,
    });
    document.removeEventListener('click', this.handleDocumentClick);
    window.removeEventListener('resize', this.updateDropdownPosition);
    window.removeEventListener('scroll', this.updateDropdownPosition, {
      capture: true,
    });

    this.closeDropdown();
  }

  private handleDocumentClick = (e: MouseEvent): void => {
    if (this.dropdown && !this.dropdown.contains(e.target as Node)) {
      this.closeDropdown();
    }
  };

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
    if (!this.dropdown || !this.isInsideAnyEditor(e.target)) return;

    const allowedKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];
    if (!allowedKeys.includes(e.key)) return;

    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % (this.users.length || 1);
      this.updateActiveItem();
      return;
    }

    if (e.key === 'ArrowUp') {
      this.activeIndex =
        (this.activeIndex - 1 + this.users.length) % (this.users.length || 1);
      this.updateActiveItem();
      return;
    }

    if (e.key === 'Enter') {
      if (this.users.length > 0) {
        this.insertMention(this.users[this.activeIndex]);
      }
      return;
    }

    if (e.key === 'Escape') {
      this.closeDropdown();
      return;
    }
  };

  triggerFromRange(range: Range): void {
    const atNode = document.createTextNode('@');
    range.deleteContents();
    range.insertNode(atNode);
    range.setStart(atNode, 1);
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

  private async fetchUsersList(query: string): Promise<MentionUser[]> {
    const data = await fetcherV2(
      `user/search?search_term=${encodeURIComponent(query)}&limit=5&offset=0`
    );
    const rawUsers = data?.users || [];

    return await Promise.all(
      rawUsers.map(async (user: MentionUser) => {
        const finalAvatarUrl = await this.getVerifiedAvatarUrl(user?.username);

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
        const fetchedUsers = await this.fetchUsersList(query);

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

  private async getVerifiedAvatarUrl(username: string): Promise<string> {
    const defaultAvatar = '/default-profile.svg';

    if (!username) return defaultAvatar;

    try {
      const response = await fetch(
        `/api/v2/storage/profiles/${username}/profile/meta`
      );

      if (!response.ok) {
        return defaultAvatar;
      }

      const data = await response.json();

      if (data && data?.url) {
        return data?.url;
      }

      return defaultAvatar;
    } catch (error) {
      console.error(`Failed to fetch avatar for ${username}`, error);
      return defaultAvatar;
    }
  }

  private showDropdown(rect: DOMRect): void {
    if (!this.dropdown) {
      this.dropdown = document.createElement('div');
      this.dropdown.classList.add('mention-dropdown');

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
    this.dropdown.style.zIndex = '9999';

    this.updateDropdownPosition();
  }

  private updateDropdownPosition = (): void => {
    if (!this.dropdown || !this.activeRange) return;

    const rect = this.activeRange.getBoundingClientRect();

    this.dropdown.style.top = `${rect.bottom + window.scrollY + 8}px`;
    this.dropdown.style.left = `${rect.left + window.scrollX}px`;
  };

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
      item.classList.toggle('active', index === this.activeIndex);
    });
  }

  private renderUsers(): void {
    const dropdown = this.dropdown;
    if (!dropdown) return;

    dropdown.textContent = '';

    if (this.users.length === 0) {
      const status = document.createElement('div');
      status.classList.add('mention-status');
      status.textContent = 'No users found';
      dropdown.appendChild(status);
      return;
    }

    const fragment = document.createDocumentFragment();

    this.users.forEach((user, index) => {
      const item = document.createElement('div');
      item.classList.add('mention-item');
      item.classList.toggle('active', index === this.activeIndex);

      const img = document.createElement('img');
      img.src = user?.avatar_url || '/default-profile.svg';
      img.classList.add('mention-avatar');
      img.alt = user?.username || '';

      const infoContainer = document.createElement('div');
      infoContainer.classList.add('mention-user-info');

      const nameSpan = document.createElement('span');
      nameSpan.classList.add('mention-name');
      nameSpan.textContent = user?.full_name || '';

      const usernameSpan = document.createElement('span');
      usernameSpan.classList.add('mention-username');
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

    const username = user?.username || '';
    const accountId = user?.account_id || '';
    const avatarUrl = user?.avatar_url || '/default-profile.svg';
    const fullName = user?.full_name || '';

    const mentionNode = document.createElement('a');
    mentionNode.href = `/${username}`;
    mentionNode.classList.add('mention-tag');
    mentionNode.dataset.username = username;
    mentionNode.dataset.id = accountId;
    mentionNode.contentEditable = 'false';

    const avatarSpan = document.createElement('span');
    avatarSpan.classList.add('mention-card-avatar');

    const avatarImg = document.createElement('img');
    avatarImg.src = avatarUrl;
    avatarImg.alt = username;
    avatarSpan.append(avatarImg);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('mention-card-fullname');
    nameSpan.textContent = fullName;

    mentionNode.append(avatarSpan, nameSpan);

    const textNode = this.activeRange.startContainer;
    const textContent = textNode.textContent || '';
    const atIndex = textContent.lastIndexOf('@', this.activeRange.startOffset);

    if (atIndex !== -1) {
      this.activeRange.setStart(textNode, atIndex);
      this.activeRange.deleteContents();
      this.activeRange.insertNode(mentionNode);

      const spaceNode = document.createTextNode('\u00A0');
      mentionNode.parentNode?.insertBefore(spaceNode, mentionNode.nextSibling);

      this.activeRange.setStart(spaceNode, 1);
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
    statusDiv.classList.add('mention-status');
    if (isError) {
      statusDiv.classList.add('error');
    }

    statusDiv.textContent = message;

    this.dropdown.appendChild(statusDiv);
  }

  private closeDropdown(): void {
    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

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
