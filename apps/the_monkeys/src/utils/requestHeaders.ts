import clientInfo from './clientInfo';
import sessionManager from './sessionManager';

export async function getAllRequestHeaders() {
  const info = await clientInfo.getInfoSafe();
  const env = clientInfo.getEnvironmentInfo();

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

    // timezone & language
    'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    'X-Languages': navigator.languages?.join(',') || navigator.language,
    'X-Timezone-Offset': String(new Date().getTimezoneOffset()),
    'X-Screen-Resolution': `${window.screen.width}x${window.screen.height}`,
    'X-Color-Depth': `${window.screen.colorDepth}`,
    'X-Is-Secure-Context': String(window.isSecureContext),

    // Session tracking
    'X-Session-ID': sessionManager.getSessionId(),
    'X-Visitor-ID': sessionManager.getVisitorId(),
  };
}
