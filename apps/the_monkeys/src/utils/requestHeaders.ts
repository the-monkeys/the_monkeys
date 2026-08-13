import clientInfo from './clientInfo';
import sessionManager from './sessionManager';

export async function getAllRequestHeaders() {
  const info = await clientInfo.getInfoSafe();
  const env = clientInfo.getEnvironmentInfo();

  const isBrowser =
    typeof window !== 'undefined' && typeof navigator !== 'undefined';

  return {
    // IP & device info
    'X-Real-IP': info.ip,
    'X-Device': info.device,
    'X-Browser': info.browser,
    'X-OS': info.os,
    'X-User-Agent': info.userAgent,

    // UI/UX environment
    'X-Viewport-Width': env.viewportWidth,
    'X-Viewport-Height': env.viewportHeight,
    'X-Dark-Mode': env.darkMode,

    // Timezone & language
    'X-Timezone': isBrowser
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'unknown',

    'X-Languages': isBrowser
      ? navigator.languages?.join(',') || navigator.language || 'unknown'
      : 'unknown',

    'X-Timezone-Offset': isBrowser
      ? String(new Date().getTimezoneOffset())
      : 'unknown',

    'X-Screen-Resolution': isBrowser
      ? `${window.screen.width}x${window.screen.height}`
      : 'unknown',

    'X-Color-Depth': isBrowser ? String(window.screen.colorDepth) : 'unknown',

    'X-Is-Secure-Context': isBrowser ? String(window.isSecureContext) : 'false',

    // Session tracking
    'X-Session-ID': sessionManager.getSessionId(),
    'X-Visitor-ID': sessionManager.getVisitorId(),
  };
}
