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
  const text = input.quote || input.description || input.title;
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
        <div style={{ display: 'flex', color: theme.muted, fontSize: 22 }}>
          {input.author?.username ? `@${input.author.username}` : ''}
        </div>
      </Row>

      <Col style={{ gap: 36 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 220,
            lineHeight: 0.8,
            color: accent,
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            height: 120,
          }}
        >
          “
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: scaleFontSize(text.length, 68, 40, 80, 260),
            lineHeight: 1.2,
            fontWeight: 600,
            letterSpacing: -0.8,
            color: theme.foreground,
          }}
        >
          {clip(text, 280)}
        </div>
      </Col>

      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <AccentBar color={accent} width={72} height={6} />
        <div style={{ display: 'flex', color: theme.muted, fontSize: 22 }}>
          {input.author?.displayName ?? 'the_monkeys'}
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
