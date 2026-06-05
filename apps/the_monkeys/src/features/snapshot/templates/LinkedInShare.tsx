import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import {
  AccentBar,
  Avatar,
  Col,
  FONT_STACK,
  Logo,
  Row,
  SHELL_BASE,
  clip,
  getShellBackground,
  scaleFontSize,
} from './_shared';

const WIDTH = 1200;
const HEIGHT = 627;

const Render = ({ input, theme, accent }: SnapshotRenderProps): JSX.Element => {
  return (
    <div
      style={{
        ...SHELL_BASE,
        width: WIDTH,
        height: HEIGHT,
        ...getShellBackground(theme, input),
        color: theme.foreground,
        padding: 56,
        justifyContent: 'space-between',
        fontFamily: FONT_STACK,
      }}
    >
      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo color={theme.foreground} accent={accent} size={24} />
        <Row style={{ gap: 8, alignItems: 'center' }}>
          <AccentBar color={accent} width={28} height={4} />
          <div
            style={{
              display: 'flex',
              color: theme.muted,
              fontSize: 20,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
            }}
          >
            Long Read
          </div>
        </Row>
      </Row>

      <Col style={{ gap: 20 }}>
        <div
          style={{
            display: 'flex',
            fontSize: input.title.length > 90 ? 44 : 54,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: -0.8,
            color: theme.foreground,
          }}
        >
          {clip(input.title, 150)}
        </div>
        {input.description ? (
          <div
            style={{
              display: 'flex',
              fontSize: scaleFontSize(
                input.description.length,
                22,
                18,
                120,
                320
              ),
              lineHeight: 1.45,
              color: theme.muted,
            }}
          >
            {clip(input.description, 320)}
          </div>
        ) : null}
      </Col>

      <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Row style={{ alignItems: 'center', gap: 14 }}>
          <Avatar
            src={input.author?.avatarUrl}
            fallback={input.author?.displayName ?? 'TM'}
            accent={accent}
            size={48}
          />
          <Col>
            <div
              style={{
                display: 'flex',
                fontSize: 20,
                fontWeight: 600,
                color: theme.foreground,
              }}
            >
              {input.author?.displayName ?? 'the_monkeys'}
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: theme.muted }}>
              Published on the_monkeys
            </div>
          </Col>
        </Row>
        {typeof input.readingTimeMin === 'number' ? (
          <div style={{ display: 'flex', color: theme.muted, fontSize: 18 }}>
            {input.readingTimeMin} min read
          </div>
        ) : null}
      </Row>
    </div>
  );
};

export const linkedinShare: SnapshotTemplate = {
  id: 'linkedin-share',
  label: 'LinkedIn',
  description: '1.91:1 share card tuned for LinkedIn feed.',
  aspect: '1200x627',
  width: WIDTH,
  height: HEIGHT,
  channels: ['linkedin'],
  Render,
};
