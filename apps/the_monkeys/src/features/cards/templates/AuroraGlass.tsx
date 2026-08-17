import { CardRenderProps, CardTemplate } from '../types';
import {
  CARD_BASE,
  CARD_HEIGHT,
  CARD_WIDTH,
  CardAvatar,
  CardLogo,
  CardQr,
  ContactList,
  NameBlock,
  SocialLinksRow,
  fullName,
  getAvatarSize,
  getCardBackground,
  getCardFont,
  getLogoSize,
  getScaledSize,
  hexToRgba,
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

  // Fall back to an accent → primary gradient when the theme has no image.
  const background = theme.backgroundImage
    ? getCardBackground(theme)
    : {
        backgroundColor: c.primaryColor,
        backgroundImage: `linear-gradient(135deg, ${c.primaryColor} 0%, ${hexToRgba(
          c.accentColor,
          0.9
        )} 100%)`,
      };

  const onGlass = '#FFFFFF';

  return (
    <div
      style={{
        ...CARD_BASE,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        ...background,
        fontFamily: getCardFont(c),
        flexDirection: 'row',
        padding: 40,
        gap: 32,
        alignItems: 'stretch',
      }}
    >
      {/* Glass content panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: hexToRgba('#FFFFFF', 0.12),
          border: `1px solid ${hexToRgba('#FFFFFF', 0.28)}`,
          borderRadius: 28,
          padding: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {c.showAvatar !== false && (
            <CardAvatar
              src={avatarUrl}
              fallback={name}
              size={getAvatarSize(c) + 20}
              shape={c.avatarShape}
              accent={hexToRgba('#FFFFFF', 0.25)}
              ring={hexToRgba('#FFFFFF', 0.4)}
            />
          )}
          <NameBlock
            name={name}
            jobTitle={contact.jobTitle}
            company={contact.company}
            department={contact.department}
            nameSize={getScaledSize(40, c)}
            nameColor={onGlass}
            nameWeight={700}
            foreground={onGlass}
            accent={hexToRgba('#FFFFFF', 0.9)}
            muted={hexToRgba('#FFFFFF', 0.72)}
          />
        </div>

        <ContactList
          contact={contact}
          color={hexToRgba('#FFFFFF', 0.92)}
          accent={hexToRgba('#FFFFFF', 0.9)}
          fontSize={getScaledSize(15, c)}
        />

        <SocialLinksRow
          links={socialLinks}
          iconColor={c.primaryColor}
          iconBg={hexToRgba('#FFFFFF', 0.92)}
          iconSize={getScaledSize(24, c)}
        />
      </div>

      {/* Side rail: logo + QR */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: showQr ? 'space-between' : 'center',
          gap: 20,
          flexShrink: 0,
        }}
      >
        <CardLogo src={logoUrl} size={getLogoSize(c)} />
        {showQr && (
          <CardQr
            src={qrDataUrl}
            size={150}
            border={hexToRgba('#FFFFFF', 0.4)}
          />
        )}
      </div>
    </div>
  );
};

export const auroraGlass: CardTemplate = {
  id: 'aurora-glass',
  label: 'Aurora Glass',
  description: 'Gradient backdrop with a frosted glass panel. Vibrant, modern.',
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  Render,
};
