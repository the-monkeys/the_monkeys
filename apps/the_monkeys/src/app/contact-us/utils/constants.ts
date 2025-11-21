export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
export const SUBJECTS = [
  'General Enquiry/ Other',
  'Feature Request',
  'Partnership/ Collaboration',
  'Technical Support/ Bug Report',
  'Account Related Help',
];

export const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 90) + 10;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
};
