import { discussionQuoteFontSize } from '../lib/discussionTextFit';
import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import { DiscussionByline, DiscussionSource } from './DiscussionAttribution';
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

      <Col style={{ gap: compact ? 18 : 36 }}>
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
              ? ({ overflowWrap: 'anywhere' } as const)
              : {}),
          }}
        >
          {input.source === 'discussion' ? text : clip(text, 280)}
        </div>
      </Col>

      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <AccentBar color={accent} width={72} height={6} />
        <div style={{ display: 'flex', color: theme.muted, fontSize: 22 }}>
          {input.source === 'discussion' ? (
            <DiscussionByline
              input={input}
              badgeSrc={assetUrls?.verifiedBadge}
            />
          ) : (
            input.author?.displayName ?? 'the_monkeys'
          )}
        </div>
      </Row>
      <DiscussionSource input={input} theme={theme} />
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
