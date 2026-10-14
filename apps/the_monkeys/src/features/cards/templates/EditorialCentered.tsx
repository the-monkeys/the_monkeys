import { CardRenderProps, CardTemplate } from '../types';
import {
  CARD_BASE,
  CARD_HEIGHT,
  CARD_WIDTH,
  CardAvatar,
  CardLogo,
  CardQr,
  ContactLine,
  Divider,
  SocialLinksRow,
  fullName,
  getAvatarSize,
  getCardBackground,
  getCardFont,
  getLogoSize,
  getScaledSize,
} from './_shared';

/**
 * Centered, symmetrical layout — logo up top, portrait, name, a hairline rule,
 * inline contact row, socials, and a QR anchored to the corner.
 */
const Render = ({
  input,
  theme,
  customization: c,
  qrDataUrl,
}: CardRenderProps): JSX.Element => {
  const { contact, socialLinks, avatarUrl, logoUrl } = input;
  const name = fullName(contact.firstName, contact.lastName);
  const showQr = c.showQr && Boolean(qrDataUrl);

  const inlineContact = [contact.email, contact.phone, contact.website].filter(
    Boolean
  ) as string[];

  return (
    <div
      style={{
        ...CARD_BASE,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        ...getCardBackground(theme),
        color: theme.foreground,
        fontFamily: getCardFont(c),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        gap: 16,
      }}
    >
      {/* QR pinned to the top-right corner */}
      {showQr && (
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 40,
            right: 40,
          }}
        >
          <CardQr src={qrDataUrl} size={110} border={theme.border} />
        </div>
      )}

      {logoUrl ? (
        <CardLogo src={logoUrl} size={getLogoSize(c)} />
      ) : c.showAvatar !== false ? (
        <CardAvatar
          src={avatarUrl}
          fallback={name}
          size={getAvatarSize(c)}
          shape={c.avatarShape}
          accent={c.accentColor}
          ring={theme.border}
        />
      ) : null}

      <div
        style={{
          display: 'flex',
          fontSize: getScaledSize(46, c),
          fontWeight: 700,
          color: theme.foreground,
          letterSpacing: -0.5,
          lineHeight: 1.1,
          textAlign: 'center',
        }}
      >
        {name || 'Your Name'}
      </div>

      {(contact.jobTitle || contact.company) && (
        <div
          style={{
            display: 'flex',
            fontSize: getScaledSize(15, c),
            color: c.accentColor,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase' as const,
            textAlign: 'center',
          }}
        >
          {[contact.jobTitle, contact.company, contact.department]
            .filter(Boolean)
            .join('  ·  ')}
        </div>
      )}

      <Divider color={theme.border} length={120} thickness={2} />

      {/* Inline contact row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {inlineContact.map((text) => (
          <ContactLine
            key={text}
            text={text}
            color={theme.muted}
            accent={c.accentColor}
            fontSize={getScaledSize(14, c)}
          />
        ))}
      </div>

      <SocialLinksRow
        links={socialLinks}
        iconColor={theme.foreground}
        iconBg={theme.surface}
        iconSize={getScaledSize(24, c)}
      />
    </div>
  );
};

export const editorialCentered: CardTemplate = {
  id: 'editorial-centered',
  label: 'Editorial',
  description: 'Symmetrical, centered layout with a corner QR. Refined.',
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  Render,
};
