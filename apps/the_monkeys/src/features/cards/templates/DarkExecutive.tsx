import { CardRenderProps, CardTemplate } from '../types';
import {
  CARD_BASE,
  CARD_HEIGHT,
  CARD_WIDTH,
  CardLogo,
  CardQr,
  ContactList,
  Divider,
  NameBlock,
  SocialLinksRow,
  fullName,
  getCardFont,
  getLogoSize,
  getScaledSize,
  hexToRgba,
} from './_shared';

const INK = '#0A0A0A';
const PAPER = '#F5F5F5';

const Render = ({
  input,
  customization: c,
  qrDataUrl,
}: CardRenderProps): JSX.Element => {
  const { contact, socialLinks, logoUrl } = input;
  const name = fullName(contact.firstName, contact.lastName);
  const showQr = c.showQr && Boolean(qrDataUrl);
  const soft = hexToRgba(PAPER, 0.62);

  return (
    <div
      style={{
        ...CARD_BASE,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: INK,
        fontFamily: getCardFont(c),
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 56,
      }}
    >
      {/* Header: logo + accent bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <CardLogo src={logoUrl} size={getLogoSize(c)} />
        <div
          style={{
            display: 'flex',
            width: 64,
            height: 4,
            backgroundColor: c.accentColor,
            borderRadius: 2,
            marginTop: 12,
          }}
        />
      </div>

      {/* Identity */}
      <NameBlock
        name={name}
        jobTitle={contact.jobTitle}
        company={contact.company}
        department={contact.department}
        nameSize={getScaledSize(46, c)}
        nameWeight={300}
        nameColor={PAPER}
        foreground={PAPER}
        accent={c.accentColor}
        muted={soft}
        titleUppercase
        gap={8}
      />

      {/* Footer: contact + QR + social */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Divider color={c.accentColor} thickness={2} length={90} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 28,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ContactList
              contact={contact}
              color={soft}
              accent={c.accentColor}
              fontSize={getScaledSize(14, c)}
              gap={6}
            />
            <SocialLinksRow
              links={socialLinks}
              iconColor={INK}
              iconBg={c.accentColor}
              iconSize={getScaledSize(22, c)}
            />
          </div>
          {showQr && (
            <CardQr
              src={qrDataUrl}
              size={132}
              border='rgba(255,255,255,0.15)'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const darkExecutive: CardTemplate = {
  id: 'dark-executive',
  label: 'Dark Executive',
  description: 'Near-black, thin serif name, accent lines and QR. Premium.',
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  Render,
};
