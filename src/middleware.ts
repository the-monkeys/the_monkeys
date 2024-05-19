export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/activity', '/create', '/settings', '/drafts'],
};
