import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import {
  AccentBar,
  BRAND_URL,
  Col,
  FONT_STACK,
  Logo,
  Row,
  SHELL_BASE,
  clip,
  getShellBackground,
} from './_shared';

const WIDTH = 1080;
const HEIGHT = 1920;

const Render = ({ input, theme, accent }: SnapshotRenderProps): JSX.Element => {
  return (
    <div
      style={{
        ...SHELL_BASE,
        width: WIDTH,
        height: HEIGHT,
        ...getShellBackground(theme, input),
        color: theme.foreground,
        padding: 96,
        justifyContent: 'space-between',
        fontFamily: FONT_STACK,
      }}
    >
      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo color={theme.foreground} accent={accent} size={32} />
        <div
          style={{
            display: 'flex',
            color: theme.muted,
            fontSize: 26,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          Story
        </div>
      </Row>

      <Col style={{ gap: 40 }}>
        <AccentBar color={accent} width={120} height={10} />
        <div
          style={{
            display: 'flex',
            fontSize: input.title.length > 60 ? 96 : 120,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: -2,
            color: theme.foreground,
          }}
        >
          {clip(input.title, 120)}
        </div>
        {input.description ? (
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              lineHeight: 1.4,
              color: theme.muted,
            }}
          >
            {clip(input.description, 180)}
          </div>
        ) : null}
      </Col>

      <Col style={{ gap: 18 }}>
        <div
          style={{
            display: 'flex',
            color: accent,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          Swipe Up to Read
        </div>
        <div style={{ display: 'flex', color: theme.muted, fontSize: 26 }}>
          {input.author?.username
            ? `@${input.author.username} · ${BRAND_URL}`
            : BRAND_URL}
        </div>
      </Col>
    </div>
  );
};

export const storyVertical: SnapshotTemplate = {
  id: 'story-vertical',
  label: 'Story / Reel',
  description: '9:16 vertical, ideal for Stories and Reels covers.',
  aspect: '1080x1920',
  width: WIDTH,
  height: HEIGHT,
  channels: ['story'],
  Render,
};
