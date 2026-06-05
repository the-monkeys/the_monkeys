import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import {
  FONT_STACK,
  Logo,
  Row,
  SERIF_STACK,
  SHELL_BASE,
  clip,
  getShellBackground,
  headlineFontSize,
  scaleFontSize,
} from './_shared';

const WIDTH = 1080;
const HEIGHT = 1350;

const Render = ({ input, theme, accent }: SnapshotRenderProps): JSX.Element => {
  const category = (input.category ?? input.tags?.[0] ?? 'Insights').trim();
  const body = (input.description ?? '').trim();
  const bodySize = body ? scaleFontSize(body.length, 32, 24, 200, 520) : 32;

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

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          gap: 36,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        {category ? (
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontWeight: 600,
              color: accent,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: -8,
            }}
          >
            {clip(category, 40)}
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            fontFamily: SERIF_STACK,
            fontSize: headlineFontSize(
              input.title,
              [
                { over: 100, size: 56 },
                { over: 60, size: 68 },
              ],
              80
            ),
            lineHeight: 1.08,
            fontWeight: 700,
            letterSpacing: -0.5,
            color: theme.foreground,
          }}
        >
          {clip(input.title, 220)}
        </div>

        {body ? (
          <div
            style={{
              display: 'flex',
              fontSize: bodySize,
              lineHeight: 1.45,
              fontWeight: 400,
              color: theme.muted,
              letterSpacing: -0.2,
            }}
          >
            {clip(body, 520)}
          </div>
        ) : null}
      </div>

      <div style={{ height: 48 }} />
    </div>
  );
};

export const editorialSerif: SnapshotTemplate = {
  id: 'editorial-forbes',
  label: 'Editorial Serif',
  description:
    'Serif IG portrait: category label, serif headline, body copy, logo.',
  aspect: '1080x1350',
  width: WIDTH,
  height: HEIGHT,
  channels: ['instagram'],
  Render,
};
