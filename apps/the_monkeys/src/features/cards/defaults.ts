import { ACCENT_PALETTE } from './themes';
import { CardContact, CardCustomization, CardInput, CardState } from './types';

export const DEFAULT_CONTACT: CardContact = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  address: '',
};

export const DEFAULT_CUSTOMIZATION: CardCustomization = {
  primaryColor: '#0A0A0A',
  accentColor: ACCENT_PALETTE[0],
  fontFamily: 'inter',
  fontSize: 'md',
  avatarShape: 'circle',
  logoSize: 'md',
  showQr: true,
  showAvatar: true,
};

export const DEFAULT_INPUT: CardInput = {
  contact: DEFAULT_CONTACT,
  socialLinks: [],
};

export const DEFAULT_TEMPLATE_ID = 'classic-clean';

export const createDefaultState = (
  overrides?: Partial<CardState>
): CardState => ({
  input: overrides?.input ?? DEFAULT_INPUT,
  templateId: overrides?.templateId ?? DEFAULT_TEMPLATE_ID,
  themeId: overrides?.themeId ?? 'light',
  customization: overrides?.customization ?? DEFAULT_CUSTOMIZATION,
});
