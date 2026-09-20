export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFormatTag(mimeType?: string, name?: string): string {
  if (mimeType) {
    const parts = mimeType.split('/');
    if (parts[1]) return parts[1].toUpperCase();
  }
  if (name && name.includes('.')) {
    return name.split('.').pop()?.toUpperCase() || 'FILE';
  }
  return 'FILE';
}
