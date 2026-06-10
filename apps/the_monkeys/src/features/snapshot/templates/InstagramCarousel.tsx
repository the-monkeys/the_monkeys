import { CSSProperties } from 'react';

import { carouselSlide2Body, carouselSlide3Body } from '../lib/carouselSlides';
import { SnapshotRenderProps, SnapshotTemplate } from '../types';
import {
  AccentBar,
  Avatar,
  BRAND_URL,
  Col,
  FONT_STACK,
  Logo,
  Row,
  SHELL_BASE,
  Tag,
  clip,
  getShellBackground,
  scaleFontSize,
} from './_shared';

const SLIDE_W = 1080;
const SLIDE_H = 1350;
const SLIDE_COUNT = 3;
const WIDTH = SLIDE_W * SLIDE_COUNT;
const HEIGHT = SLIDE_H;
const GUTTER = 0; // exported as 3 separate 1080×1350 files; slides must be flush

interface SlideShellProps {
  children: React.ReactNode;
  background: CSSProperties;
  foreground: string;
  marginRight: number;
}

const SlideShell = ({
  children,
  background,
  foreground,
  marginRight,
}: SlideShellProps): JSX.Element => (
  <div
    style={{
      ...SHELL_BASE,
      width: SLIDE_W,
      height: SLIDE_H,
      ...background,
      color: foreground,
      padding: 72,
      justifyContent: 'space-between',
      fontFamily: FONT_STACK,
      marginRight,
    }}
  >
    {children}
  </div>
);

const Render = ({ input, theme, accent }: SnapshotRenderProps): JSX.Element => {
  const background = getShellBackground(theme, input);
  const slide2Body = carouselSlide2Body(input.description, input.title);
  const slide3Body = carouselSlide3Body(input.description, input.title);

  const titleSize =
    input.title.length > 80 ? 64 : input.title.length > 40 ? 76 : 92;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: theme.border,
        fontFamily: FONT_STACK,
      }}
    >
      {/* SLIDE 1 — Cover */}
      <SlideShell
        background={background}
        foreground={theme.foreground}
        marginRight={GUTTER}
      >
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo color={theme.foreground} accent={accent} size={30} />
          <div
            style={{
              display: 'flex',
              color: theme.muted,
              fontSize: 20,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            1 / {SLIDE_COUNT}
          </div>
        </Row>

        <Col style={{ gap: 28 }}>
          <AccentBar color={accent} width={84} height={8} />
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -1.5,
              color: theme.foreground,
            }}
          >
            {clip(input.title, 160)}
          </div>
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
              size={64}
            />
            <Col>
              <div
                style={{
                  display: 'flex',
                  fontSize: 26,
                  fontWeight: 600,
                  color: theme.foreground,
                }}
              >
                {input.author?.displayName ?? 'the_monkeys'}
              </div>
              {input.author?.username ? (
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    color: theme.muted,
                  }}
                >
                  @{input.author.username}
                </div>
              ) : null}
            </Col>
          </Row>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: theme.muted,
              fontWeight: 500,
            }}
          >
            Swipe →
          </div>
        </Row>
      </SlideShell>

      {/* SLIDE 2 — Body excerpt (description, not pull-quote) */}
      <SlideShell
        background={background}
        foreground={theme.foreground}
        marginRight={GUTTER}
      >
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo color={theme.foreground} accent={accent} size={30} />
          <div
            style={{
              display: 'flex',
              color: theme.muted,
              fontSize: 20,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            2 / {SLIDE_COUNT}
          </div>
        </Row>

        <Col style={{ gap: 28, justifyContent: 'center', flex: 1 }}>
          <AccentBar color={accent} width={84} height={8} />
          <div
            style={{
              display: 'flex',
              fontSize: scaleFontSize(slide2Body.length, 48, 32, 200, 420),
              lineHeight: 1.35,
              fontWeight: 500,
              color: theme.foreground,
              letterSpacing: -0.4,
            }}
          >
            {clip(slide2Body, 420)}
          </div>
        </Col>

        <Row
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 28,
            borderTop: `2px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: theme.muted,
              fontWeight: 500,
            }}
          >
            Swipe →
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: theme.muted,
            }}
          >
            {BRAND_URL}
          </div>
        </Row>
      </SlideShell>

      {/* SLIDE 3 — Continuation + CTA */}
      <SlideShell
        background={background}
        foreground={theme.foreground}
        marginRight={0}
      >
        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo color={theme.foreground} accent={accent} size={30} />
          <div
            style={{
              display: 'flex',
              color: theme.muted,
              fontSize: 20,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            3 / {SLIDE_COUNT}
          </div>
        </Row>

        <Col style={{ gap: 24, justifyContent: 'center', flex: 1 }}>
          <AccentBar color={accent} width={84} height={8} />
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              lineHeight: 1.35,
              color: theme.foreground,
              fontWeight: 500,
            }}
          >
            {clip(slide3Body, 420)}
          </div>
        </Col>

        <Col style={{ gap: 18 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              fontWeight: 700,
              color: accent,
              letterSpacing: -0.4,
            }}
          >
            Read the full story →
          </div>
          <Row
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 24,
              borderTop: `2px solid ${theme.border}`,
            }}
          >
            <Row style={{ alignItems: 'center', gap: 14 }}>
              <Avatar
                src={input.author?.avatarUrl}
                fallback={input.author?.displayName ?? 'TM'}
                accent={accent}
                size={56}
              />
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  color: theme.foreground,
                  fontWeight: 600,
                }}
              >
                {input.author?.displayName ?? 'the_monkeys'}
              </div>
            </Row>
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                color: theme.muted,
                fontWeight: 600,
              }}
            >
              {BRAND_URL}
            </div>
          </Row>
        </Col>
      </SlideShell>
    </div>
  );
};

export const instagramCarousel: SnapshotTemplate = {
  id: 'instagram-carousel',
  label: 'Instagram Carousel',
  description:
    "3 separate 1080×1350 slides (cover, body excerpt, CTA) — downloaded as three files ready for Instagram's carousel uploader.",
  aspect: '3240x1350',
  width: WIDTH,
  height: HEIGHT,
  channels: ['instagram'],
  slice: {
    count: SLIDE_COUNT,
    sliceWidth: SLIDE_W,
    sliceHeight: SLIDE_H,
  },
  Render,
};
