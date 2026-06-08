/**
 * Snapshot v2 — Type contracts
 *
 * Design rule: every template is Satori-safe so the SAME component file can be
 * rendered today by `html-to-image` in the browser AND later by Satori inside
 * the `the_monkeys_cast` Node sidecar with zero code changes.
 *
 * Satori constraints (do not break):
 *   - Only `<div>`, `<span>`, `<img>` elements.
 *   - Only inline `style={{...}}`.
 *   - Flex layouts only (no grid, no float, no position:absolute without left/top).
 *   - Explicit pixel sizes on the root.
 *   - Web-safe fonts; pass fonts in at render time when on the server.
 */

export type SnapshotSource = 'blog' | 'meta-blog' | 'url' | 'tweet' | 'manual';

export interface SnapshotAuthor {
  username: string;
  displayName: string;
  avatarUrl?: string; // remote URL (image proxy handled by export pipeline)
}

export interface SnapshotInput {
  source: SnapshotSource;
  /** Stable id of the originating object (blog_id, tweet_id, url hash, ...). */
  sourceId?: string;
  /** Public canonical URL of the original post (optional, shown as footer). */
  sourceUrl?: string;
  title: string;
  /** Small category label (e.g. "Money") for editorial-forbes template. */
  category?: string;
  description?: string;
  /** Short pull-quote, used by quote-style templates. */
  quote?: string;
  /** Hero image URL, used by templates that show media inline. */
  heroImageUrl?: string;
  /**
   * Full-bleed background image (overrides theme background when set).
   * Should be a same-origin URL or a data: URL so canvas export does not taint.
   */
  backgroundImageUrl?: string;
  /** 0..1 darken overlay applied above the background image (default 0.55). */
  backgroundOverlay?: number;
  tags?: string[];
  author?: SnapshotAuthor;
  publishedAt?: string; // ISO
  readingTimeMin?: number;
}

export type SnapshotThemeMode = 'light' | 'dark';

export interface SnapshotTheme {
  id: string;
  label: string;
  mode: SnapshotThemeMode;
  background: string;
  /**
   * Optional CSS `background-image` value (e.g. a linear-gradient). When set,
   * templates render this in place of the solid `background` colour. Keep it
   * Satori-safe: only `linear-gradient` / `radial-gradient` are supported.
   */
  backgroundImage?: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  accent: string; // overridden by per-snapshot accent
}

export type SnapshotAspect =
  | '1080x1350' // Instagram portrait
  | '1080x1080' // Square
  | '1200x675' // X / Twitter share
  | '1200x627' // LinkedIn share
  | '1080x1920' // Story / Reel
  | '3240x1350'; // Instagram carousel (3× portrait slides)

export interface SnapshotTemplateMeta {
  id: string;
  label: string;
  description: string;
  aspect: SnapshotAspect;
  width: number;
  height: number;
  /** Channels this template is tuned for, used for sorting in the picker. */
  channels: Array<'instagram' | 'x' | 'linkedin' | 'story' | 'thread'>;
  /**
   * If set, the rendered output is sliced horizontally into `count` equal
   * sub-images on export and each is downloaded as a separate file. Used by
   * multi-slide templates like the Instagram carousel.
   */
  slice?: {
    count: number;
    sliceWidth: number;
    sliceHeight: number;
  };
}

export interface SnapshotRenderProps {
  input: SnapshotInput;
  theme: SnapshotTheme;
  accent: string;
}

export interface SnapshotTemplate extends SnapshotTemplateMeta {
  Render: (props: SnapshotRenderProps) => JSX.Element;
}

export interface SnapshotExportOptions {
  /** Multiplier on top of the template's native pixel size. */
  pixelRatio?: number;
  /** PNG (default) or JPEG. */
  format?: 'png' | 'jpeg';
  /** JPEG quality 0..1, ignored for png. */
  quality?: number;
  /** File name without extension. */
  filename?: string;
  /** Whether to trigger a browser download. If false, returns the blob without downloading. */
  download?: boolean;
  /** PNG export with alpha (video overlay compositing). */
  transparent?: boolean;
}

export interface SnapshotState {
  input: SnapshotInput;
  templateId: string;
  themeId: string;
  accent: string;
}
