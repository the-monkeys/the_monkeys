import { CardRenderProps, CardTemplate } from '../types';
import {
  CARD_BASE,
  CARD_HEIGHT,
  CARD_WIDTH,
  CardLogo,
  CardQr,
  ContactList,
  NameBlock,
  SocialLinksRow,
  fullName,
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
  const { contact, socialLinks, logoUrl } = input;
  const name = fullName(contact.firstName, contact.lastName);
  const showQr = c.showQr && Boolean(qrDataUrl);

  return (
    <div
      style={{
        ...CARD_BASE,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: c.accentColor,
        fontFamily: getCardFont(c),
        flexDirection: 'column',
      }}
    >
      {/* Accent hero */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '48px 56px 28px',
          flex: 1,
          gap: 32,
        }}
      >
        <NameBlock
          name={name}
          jobTitle={contact.jobTitle}
          nameSize={getScaledSize(52, c)}
          nameColor='#FFFFFF'
          nameWeight={800}
          foreground='#FFFFFF'
          accent={hexToRgba('#FFFFFF', 0.85)}
          muted={hexToRgba('#FFFFFF', 0.7)}
          titleUppercase
        />
        <CardLogo src={logoUrl} size={getLogoSize(c)} />
      </div>

      {/* Info bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: theme.background,
          padding: '26px 56px',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
        >
          {(contact.company || contact.department) && (
            <div
              style={{
                display: 'flex',
                fontSize: getScaledSize(16, c),
                color: theme.foreground,
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              {[contact.company, contact.department]
                .filter(Boolean)
                .join(' · ')}
            </div>
          )}
          <ContactList
            contact={contact}
            color={theme.muted}
            accent={c.accentColor}
            fontSize={getScaledSize(14, c)}
            gap={6}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <SocialLinksRow
            links={socialLinks}
            iconColor='#FFFFFF'
            iconBg={c.accentColor}
            iconSize={getScaledSize(22, c)}
          />
        </div>

        {showQr && <CardQr src={qrDataUrl} size={116} border={theme.border} />}
      </div>
    </div>
  );
};

export const modernMinimal: CardTemplate = {
  id: 'modern-minimal',
  label: 'Modern Minimal',
  description: 'Bold accent hero with an oversized name and info bar.',
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  Render,
};
