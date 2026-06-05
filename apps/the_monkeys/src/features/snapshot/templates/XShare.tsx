import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import {
  Avatar,
  BRAND_URL,
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
const HEIGHT = 675;

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
        {input.tags && input.tags[0] ? (
          <div
            style={{
              display: 'flex',
              color: accent,
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            #{input.tags[0]}
          </div>
        ) : null}
      </Row>

      <Col style={{ gap: 16 }}>
        <div
          style={{
            display: 'flex',
            fontSize: input.title.length > 80 ? 48 : 58,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: -1,
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
                22,
                18,
                100,
                280
              ),
              lineHeight: 1.4,
              color: theme.muted,
            }}
          >
            {clip(input.description, 280)}
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
            {input.author?.username ? (
              <div
                style={{ display: 'flex', fontSize: 18, color: theme.muted }}
              >
                @{input.author.username}
              </div>
            ) : null}
          </Col>
        </Row>
        <div style={{ display: 'flex', color: theme.muted, fontSize: 18 }}>
          themonkeys.live
        </div>
      </Row>
    </div>
  );
};

export const xShare: SnapshotTemplate = {
  id: 'x-share',
  label: 'X / Twitter',
  description: '16:9 share card optimised for X timelines.',
  aspect: '1200x675',
  width: WIDTH,
  height: HEIGHT,
  channels: ['x'],
  Render,
};
