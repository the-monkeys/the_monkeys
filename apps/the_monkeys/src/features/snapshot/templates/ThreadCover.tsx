import { SnapshotRenderProps, SnapshotTemplate } from '../types';
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

const Render = ({ input, theme, accent }: SnapshotRenderProps): JSX.Element => {
  return (
    <div
      style={{
        ...SHELL_BASE,
        width: WIDTH,
        height: HEIGHT,
        ...getShellBackground(theme, input),
        color: theme.foreground,
        padding: 80,
        justifyContent: 'space-between',
        fontFamily: FONT_STACK,
      }}
    >
      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo color={theme.foreground} accent={accent} size={28} />
        <div
          style={{
            display: 'flex',
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: accent,
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 700,
            borderRadius: 8,
            letterSpacing: 0.4,
          }}
        >
          THREAD ↓
        </div>
      </Row>

      <Col style={{ gap: 28 }}>
        <AccentBar color={accent} width={84} height={8} />
        <div
          style={{
            display: 'flex',
            fontSize: input.title.length > 60 ? 70 : 86,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: -1.4,
            color: theme.foreground,
          }}
        >
          {clip(input.title, 140)}
        </div>
        {input.description ? (
          <div
            style={{
              display: 'flex',
              fontSize: scaleFontSize(
                input.description.length,
                28,
                22,
                140,
                360
              ),
              lineHeight: 1.4,
              color: theme.muted,
            }}
          >
            {clip(input.description, 360)}
          </div>
        ) : null}
      </Col>

      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', color: theme.muted, fontSize: 22 }}>
          {input.author?.username ? `@${input.author.username}` : 'the_monkeys'}
        </div>
        <div
          style={{
            display: 'flex',
            color: theme.muted,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          Swipe →
        </div>
      </Row>
    </div>
  );
};

export const threadCover: SnapshotTemplate = {
  id: 'thread-cover',
  label: 'Thread Cover',
  description: '1:1 cover that signals a thread or carousel.',
  aspect: '1080x1080',
  width: WIDTH,
  height: HEIGHT,
  channels: ['thread', 'instagram'],
  Render,
};
