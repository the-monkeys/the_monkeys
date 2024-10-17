export function parseDateTime(datetime: string): string {
  const date = new Date(datetime);

  const pad = (num: number) => String(num).padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are zero-indexed
  const day = pad(date.getUTCDate());

  return `${year}-${month}-${day}`;
}

export function parseDateOnly(dateTimeString: string): string {
  const match = dateTimeString.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}
