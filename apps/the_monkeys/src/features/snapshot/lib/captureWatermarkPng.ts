/**
 * Two separate watermark badges for video export:
 *
 *  captureBrandBadgePng()  - top-left of video:   [Logo]  monkeys.com.co.
 *  captureAuthorBadgePng() - bottom-left of video: [DA]  Dave Augustus
 *                                                        @dave
 *
 * The backend applies each PNG as a separate FFmpeg overlay.
 */

const LOGO_ASSET_PATH = '/logo-brand.svg';
const BRAND_DOMAIN = 'monkeys.com.co';

const LOGO_W = 52;
const LOGO_H = Math.round((LOGO_W * 440) / 538);

const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const PAD_H = 18;
const PAD_V = 12;
const ITEM_GAP = 14;

const loadSvg = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });

function getInitials(displayName: string, username: string): string {
  const src = displayName.trim() || username.trim();
  if (!src) return 'TM';
  const words = src.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

/** TOP-LEFT: logo + monkeys.com.co */
export async function captureBrandBadgePng(
  watermarkColor = '#FFFFFF',
  accentColor = '#FF5542'
): Promise<string> {
  const logo = await loadSvg(LOGO_ASSET_PATH);
  const FONT_SIZE = 30;

  const tmp = document.createElement('canvas');
  tmp.width = 800;
  tmp.height = 100;
  const m = tmp.getContext('2d')!;
  m.font = `700 ${FONT_SIZE}px ${FONT_FAMILY}`;
  const domainW = m.measureText(BRAND_DOMAIN).width;
  const dotW = m.measureText('.').width;

  const rowH = Math.max(LOGO_H, FONT_SIZE);
  const canvasW = Math.ceil(PAD_H + LOGO_W + ITEM_GAP + domainW + dotW + PAD_H);
  const canvasH = Math.ceil(PAD_V + rowH + PAD_V);

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath();
  ctx.roundRect(0, 0, canvasW, canvasH, Math.min(canvasH / 2, 20));
  ctx.fill();

  ctx.drawImage(logo, PAD_H, PAD_V + (rowH - LOGO_H) / 2, LOGO_W, LOGO_H);

  const textX = PAD_H + LOGO_W + ITEM_GAP;
  const textY = PAD_V + (rowH + FONT_SIZE) / 2 - 2;
  ctx.font = `700 ${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.fillStyle = watermarkColor;
  ctx.fillText(BRAND_DOMAIN, textX, textY);
  ctx.fillStyle = accentColor;
  ctx.fillText('.', textX + domainW, textY);

  return canvas.toDataURL('image/png');
}

/** BOTTOM-LEFT: initials circle + Full Name / @username */
export async function captureAuthorBadgePng(
  watermarkColor = '#FFFFFF',
  accentColor = '#FF5542',
  displayName = '',
  username = ''
): Promise<string> {
  const AVATAR_D = 46;
  const AVATAR_R = AVATAR_D / 2;
  const AVATAR_FONT = 17;
  const NAME_FONT = 26;
  const HANDLE_FONT = 20;
  const SUB_GAP = 5;

  const nameText = displayName || username || 'the_monkeys';
  const handleText = username ? `@${username}` : '';

  const tmp = document.createElement('canvas');
  tmp.width = 800;
  tmp.height = 100;
  const m = tmp.getContext('2d')!;
  m.font = `600 ${NAME_FONT}px ${FONT_FAMILY}`;
  const nameW = m.measureText(nameText).width;
  m.font = `400 ${HANDLE_FONT}px ${FONT_FAMILY}`;
  const handleW = handleText ? m.measureText(handleText).width : 0;

  const textBlockH = NAME_FONT + (handleText ? SUB_GAP + HANDLE_FONT : 0);
  const rowH = Math.max(AVATAR_D, textBlockH);
  const canvasW = Math.ceil(
    PAD_H + AVATAR_D + ITEM_GAP + Math.max(nameW, handleW) + PAD_H
  );
  const canvasH = Math.ceil(PAD_V + rowH + PAD_V);

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath();
  ctx.roundRect(0, 0, canvasW, canvasH, Math.min(canvasH / 2, 20));
  ctx.fill();

  const cx = PAD_H + AVATAR_R;
  const cy = PAD_V + (rowH - AVATAR_D) / 2 + AVATAR_R;
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(cx, cy, AVATAR_R, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `700 ${AVATAR_FONT}px ${FONT_FAMILY}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getInitials(displayName, username), cx, cy);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const textX = PAD_H + AVATAR_D + ITEM_GAP;
  const topY = PAD_V + (rowH - textBlockH) / 2;

  ctx.font = `600 ${NAME_FONT}px ${FONT_FAMILY}`;
  ctx.fillStyle = watermarkColor;
  ctx.fillText(nameText, textX, topY + NAME_FONT);

  if (handleText) {
    ctx.font = `400 ${HANDLE_FONT}px ${FONT_FAMILY}`;
    ctx.fillStyle = watermarkColor;
    ctx.globalAlpha = 0.75;
    ctx.fillText(handleText, textX, topY + NAME_FONT + SUB_GAP + HANDLE_FONT);
    ctx.globalAlpha = 1.0;
  }

  return canvas.toDataURL('image/png');
}

/** @deprecated Use captureBrandBadgePng + captureAuthorBadgePng. */
export async function captureWatermarkPng(
  watermarkColor = '#FFFFFF',
  accentColor = '#FF5542',
  _displayName = '',
  _username = ''
): Promise<string> {
  return captureBrandBadgePng(watermarkColor, accentColor);
}
