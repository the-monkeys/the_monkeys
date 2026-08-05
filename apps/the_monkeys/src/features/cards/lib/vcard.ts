import { CardContact, SocialLink } from '../types';

/**
 * Sanitize a string for vCard format: strip control characters that could
 * cause injection, escape commas/semicolons/backslashes per RFC 6350.
 */
const sanitize = (value: string): string =>
  value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

/**
 * Generate a vCard 3.0 (.vcf) string from card contact data.
 */
export const generateVCard = (
  contact: CardContact,
  socialLinks: SocialLink[] = []
): string => {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${sanitize(contact.lastName)};${sanitize(contact.firstName)};;;`,
    `FN:${sanitize(contact.firstName)} ${sanitize(contact.lastName)}`,
  ];

  if (contact.jobTitle) {
    lines.push(`TITLE:${sanitize(contact.jobTitle)}`);
  }
  if (contact.company) {
    lines.push(`ORG:${sanitize(contact.company)}`);
  }
  if (contact.department) {
    lines.push(`X-DEPARTMENT:${sanitize(contact.department)}`);
  }
  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${sanitize(contact.email)}`);
  }
  if (contact.phone) {
    lines.push(`TEL;TYPE=CELL:${sanitize(contact.phone)}`);
  }
  if (contact.website) {
    lines.push(`URL:${sanitize(contact.website)}`);
  }
  if (contact.address) {
    lines.push(`ADR;TYPE=WORK:;;${sanitize(contact.address)};;;;`);
  }

  for (const link of socialLinks) {
    lines.push(
      `X-SOCIALPROFILE;TYPE=${sanitize(link.network)}:${sanitize(link.url)}`
    );
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
};

/**
 * Trigger a .vcf file download in the browser.
 */
export const downloadVCard = (
  contact: CardContact,
  socialLinks: SocialLink[] = []
) => {
  const content = generateVCard(contact, socialLinks);
  const blob = new Blob([content], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${contact.firstName}-${contact.lastName}.vcf`
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
