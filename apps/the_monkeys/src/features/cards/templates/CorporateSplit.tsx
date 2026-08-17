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
  getCardFont,
  getLogoSize,
  getScaledSize,
  hexToRgba,
} from './_shared';

const SPLIT_WIDTH = 400;

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
        fontFamily: getCardFont(c),
        flexDirection: 'row',
      }}
    >
      {/* Color panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: SPLIT_WIDTH,
          height: CARD_HEIGHT,
          backgroundColor: c.primaryColor,
          padding: 44,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {c.showAvatar !== false && (
          <CardAvatar
            src={avatarUrl}
            fallback={name}
            size={getAvatarSize(c) + 36}
            shape={c.avatarShape}
            accent={c.accentColor}
            ring={hexToRgba('#FFFFFF', 0.25)}
          />
        )}

        <NameBlock
          name={name}
          jobTitle={contact.jobTitle}
          nameSize={getScaledSize(30, c)}
          nameColor='#FFFFFF'
          foreground='#FFFFFF'
          accent={c.accentColor}
          muted={hexToRgba('#FFFFFF', 0.7)}
          align='center'
        />

        <SocialLinksRow
          links={socialLinks}
          iconColor={c.primaryColor}
          iconBg={hexToRgba('#FFFFFF', 0.92)}
          iconSize={getScaledSize(24, c)}
        />
      </div>

      {/* Details panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          backgroundColor: theme.background,
          padding: '48px 48px',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {contact.company || contact.department ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {contact.company && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: getScaledSize(20, c),
                    fontWeight: 700,
                    color: theme.foreground,
                  }}
                >
                  {contact.company}
                </div>
              )}
              {contact.department && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: getScaledSize(14, c),
                    fontWeight: 500,
                    color: theme.muted,
                  }}
                >
                  {contact.department}
                </div>
              )}
            </div>
          ) : (
            <span />
          )}
          <CardLogo src={logoUrl} size={getLogoSize(c)} />
        </div>

        <ContactList
          contact={contact}
          color={theme.foreground}
          accent={c.accentColor}
          fontSize={getScaledSize(15, c)}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: getScaledSize(12, c),
              color: theme.muted,
              letterSpacing: 1,
              textTransform: 'uppercase' as const,
            }}
          >
            {showQr ? 'Scan to save contact' : ''}
          </div>
          {showQr && (
            <CardQr src={qrDataUrl} size={128} border={theme.border} />
          )}
        </div>
      </div>
    </div>
  );
};

export const corporateSplit: CardTemplate = {
  id: 'corporate-split',
  label: 'Corporate Split',
  description: 'Color portrait panel beside a clean details panel with QR.',
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  Render,
};
