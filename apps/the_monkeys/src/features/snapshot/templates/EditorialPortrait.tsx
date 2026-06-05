import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import {
  AccentBar,
  Avatar,
  Col,
  FONT_STACK,
  Logo,
  Row,
  SHELL_BASE,
  Tag,
  clip,
  getShellBackground,
  headlineFontSize,
  scaleFontSize,
} from './_shared';

const WIDTH = 1080;
const HEIGHT = 1350;

const Render = ({ input, theme, accent }: SnapshotRenderProps): JSX.Element => {
  return (
    <div
      style={{
        ...SHELL_BASE,
        width: WIDTH,
        height: HEIGHT,
        ...getShellBackground(theme, input),
        color: theme.foreground,
        padding: 72,
        justifyContent: 'space-between',
        fontFamily: FONT_STACK,
      }}
    >
      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo color={theme.foreground} accent={accent} size={30} />
        <div
          style={{
            display: 'flex',
            color: theme.muted,
            fontSize: 22,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}
        >
          Snapshot
        </div>
      </Row>

      <Col style={{ gap: 28, flex: 1, justifyContent: 'center' }}>
        <AccentBar color={accent} width={84} height={8} />

        <div
          style={{
            display: 'flex',
            fontSize: headlineFontSize(
              input.title,
              [
                { over: 80, size: 64 },
                { over: 40, size: 76 },
              ],
              92
            ),
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: -1.5,
            color: theme.foreground,
          }}
        >
          {clip(input.title, 200)}
        </div>

        {input.description ? (
          <div
            style={{
              display: 'flex',
              fontSize: scaleFontSize(
                input.description.length,
                30,
                22,
                180,
                520
              ),
              lineHeight: 1.4,
              color: theme.muted,
              fontWeight: 400,
              letterSpacing: -0.3,
            }}
          >
            {clip(input.description, 520)}
          </div>
        ) : null}

        {input.tags && input.tags.length ? (
          <Row style={{ gap: 12, flexWrap: 'wrap' }}>
            {input.tags.slice(0, 4).map((t) => (
              <Tag
                key={t}
                label={`#${t}`}
                color={theme.foreground}
                bg={theme.surface}
              />
            ))}
          </Row>
        ) : null}
      </Col>

      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 28,
          borderTop: `2px solid ${theme.border}`,
        }}
      >
        <Row style={{ alignItems: 'center', gap: 18 }}>
          <Avatar
            src={input.author?.avatarUrl}
            fallback={input.author?.displayName ?? 'TM'}
            accent={accent}
            size={72}
          />
          <Col>
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                fontWeight: 600,
                color: theme.foreground,
              }}
            >
              {input.author?.displayName ?? 'the_monkeys'}
            </div>
            {input.author?.username ? (
              <div
                style={{ display: 'flex', fontSize: 22, color: theme.muted }}
              >
                @{input.author.username}
              </div>
            ) : null}
          </Col>
        </Row>

        {typeof input.readingTimeMin === 'number' ? (
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: theme.muted,
              fontWeight: 500,
            }}
          >
            {input.readingTimeMin} min read
          </div>
        ) : null}
      </Row>
    </div>
  );
};

export const editorialPortrait: SnapshotTemplate = {
  id: 'editorial-portrait',
  label: 'Editorial Portrait',
  description: 'Magazine-style 4:5 with bold headline and author footer.',
  aspect: '1080x1350',
  width: WIDTH,
  height: HEIGHT,
  channels: ['instagram'],
  Render,
};
