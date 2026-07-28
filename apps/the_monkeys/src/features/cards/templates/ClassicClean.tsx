import { CardRenderProps, CardTemplate } from '../types';
import {
  CARD_BASE,
  CARD_HEIGHT,
  CARD_WIDTH,
  CardAvatar,
  CardLogo,
  CardQr,
  ContactList,
  Divider,
  NameBlock,
  SocialLinksRow,
  fullName,
  getAvatarSize,
  getCardBackground,
  getCardFont,
  getLogoSize,
  getScaledSize,
} from './_shared';

const Render = ({
  input,
  theme,
  customization: c,
  qrDataUrl,
}: CardRenderProps): JSX.Element => {
  const { contact, socialLinks, avatarUrl, logoUrl } = input;
  const name = fullName(contact.firstName, contact.lastName);
  const showQr = c.showQr && Boolean(qrDataUrl);

  return (
    <div
      style={{
        ...CARD_BASE,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        ...getCardBackground(theme),
        color: theme.foreground,
        fontFamily: getCardFont(c),
        flexDirection: 'row',
        padding: 56,
        gap: 44,
        alignItems: 'stretch',
      }}
    >
      {/* Accent spine */}
      <div
        style={{
          display: 'flex',
          width: 6,
          borderRadius: 6,
          backgroundColor: c.accentColor,
          flexShrink: 0,
        }}
      />

      {/* Identity column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          flexShrink: 0,
        }}
      >
        {c.showAvatar !== false && (
          <CardAvatar
            src={avatarUrl}
            fallback={name}
            size={getAvatarSize(c) + 24}
            shape={c.avatarShape}
            accent={c.accentColor}
            ring={theme.border}
          />
        )}
        <CardLogo src={logoUrl} size={getLogoSize(c)} />
      </div>

      {/* Details column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 18,
          flex: 1,
          minWidth: 0,
        }}
      >
        <NameBlock
          name={name}
          jobTitle={contact.jobTitle}
          company={contact.company}
          department={contact.department}
          nameSize={getScaledSize(44, c)}
          foreground={theme.foreground}
          accent={c.accentColor}
          muted={theme.muted}
        />

        <Divider color={theme.border} length={90} thickness={2} />

        <ContactList
          contact={contact}
          color={theme.foreground}
          accent={c.accentColor}
          fontSize={getScaledSize(15, c)}
        />

        <SocialLinksRow
          links={socialLinks}
          iconColor={theme.foreground}
          iconBg={theme.surface}
          iconSize={getScaledSize(24, c)}
        />
      </div>

      {/* QR column */}
      {showQr && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <CardQr src={qrDataUrl} size={140} border={theme.border} />
          <div
            style={{
              display: 'flex',
              fontSize: getScaledSize(11, c),
              color: theme.muted,
              letterSpacing: 1,
              textTransform: 'uppercase' as const,
            }}
          >
            Scan to save
          </div>
        </div>
      )}
    </div>
  );
};

export const classicClean: CardTemplate = {
  id: 'classic-clean',
  label: 'Classic Clean',
  description: 'Accent spine, portrait, and a scannable QR. Timeless.',
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  Render,
};
