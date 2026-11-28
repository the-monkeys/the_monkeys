import { discussionQuoteFontSize } from '../lib/discussionTextFit';
import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import { DiscussionByline } from './DiscussionAttribution';
import { DiscussionQuoteMark } from './DiscussionQuoteMark';
import {
  AccentBar,
  Col,
  FONT_STACK,
  Logo,
  Row,
  SHELL_BASE,
  clip,
  getShellBackground,
  scaleFontSize,
} from './_shared';

const WIDTH = 1080;
const HEIGHT = 1080;

const Render = ({
  input,
  theme,
  accent,
  renderSize,
  assetUrls,
}: SnapshotRenderProps): JSX.Element => {
  const text = input.quote || input.description || input.title;
  const width = renderSize?.width ?? WIDTH;
  const height = renderSize?.height ?? HEIGHT;
  const compact = Boolean(renderSize && height < 800);
  const padding = compact ? 48 : 80;
  const discussion = input.source === 'discussion';
  const bylineSize = compact ? 28 : 36;
  return (
    <div
      style={{
        ...SHELL_BASE,
        width,
        height,
        ...getShellBackground(theme, input),
        color: theme.foreground,
        padding,
        justifyContent: 'space-between',
        fontFamily: FONT_STACK,
      }}
    >
      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo
          color={theme.foreground}
          accent={accent}
          size={28}
          src={assetUrls?.logo}
        />
        <div style={{ display: 'flex', color: theme.muted, fontSize: 22 }}>
          {input.source !== 'discussion' && input.author?.username
            ? `@${input.author.username}`
            : ''}
        </div>
      </Row>

      <Col
        style={{
          gap: compact ? 18 : 36,
          ...(discussion ? { width: '100%', minWidth: 0, flexShrink: 0 } : {}),
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: compact ? 140 : 220,
            lineHeight: 0.8,
            color: accent,
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            height: compact ? 70 : 120,
          }}
        >
          {input.source === 'discussion' ? (
            <DiscussionQuoteMark accent={accent} compact={compact} />
          ) : (
            '“'
          )}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize:
              input.source === 'discussion'
                ? discussionQuoteFontSize(
                    text,
                    width - padding * 2,
                    compact ? 280 : 500,
                    compact ? 48 : 68
                  )
                : scaleFontSize(text.length, 68, 40, 80, 260),
            lineHeight: 1.2,
            fontWeight: 600,
            letterSpacing: -0.8,
            color: theme.foreground,
            ...(input.source === 'discussion'
              ? ({
                  width: '100%',
                  minWidth: 0,
                  wordBreak: 'break-word',
                  flexWrap: 'wrap',
                  alignContent: 'flex-start',
                  overflowWrap: 'anywhere',
                } as const)
              : {}),
          }}
        >
          {/* Word boxes preserve natural wrapping; Satori otherwise refuses a break before #/@. */}
          {discussion
            ? (text.match(/\S+\s*|\s+/g) ?? []).map((word, index) => (
                <span
                  key={index}
                  style={{
                    display: 'flex',
                    minWidth: 0,
                    maxWidth: '100%',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    marginRight: /\s$/.test(word) ? '0.25em' : 0,
                  }}
                >
                  {word}
                </span>
              ))
            : clip(text, 280)}
        </div>
      </Col>

      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          ...(discussion ? { gap: 32, flexShrink: 0 } : {}),
        }}
      >
        <AccentBar color={accent} width={72} height={6} />
        <div
          style={{
            display: 'flex',
            color: theme.muted,
            fontSize: discussion ? bylineSize : 22,
            ...(discussion
              ? {
                  minWidth: 0,
                  maxWidth: width - padding * 2 - 104,
                  lineHeight: 1.2,
                }
              : {}),
          }}
        >
          {input.source === 'discussion' ? (
            <DiscussionByline
              input={input}
              badgeSrc={assetUrls?.verifiedBadge}
              badgeSize={bylineSize}
              maxWidth={width - padding * 2 - 104}
            />
          ) : (
            input.author?.displayName ?? 'the_monkeys'
          )}
        </div>
      </Row>
    </div>
  );
};

export const quoteCard: SnapshotTemplate = {
  id: 'quote-card',
  label: 'Quote Card',
  description: 'Pull-quote in a 1:1 frame, ideal for IG feed.',
  aspect: '1080x1080',
  width: WIDTH,
  height: HEIGHT,
  channels: ['instagram'],
  Render,
};
