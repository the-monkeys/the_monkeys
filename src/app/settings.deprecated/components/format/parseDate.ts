export function parseDateTime(datetime: string): string {
  const date = new Date(datetime);

  const pad = (num: number) => String(num).padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());

  return `${year}-${month}-${day}`;
}

export function parseDateOnly(dateTimeString: string): string {
  const match = dateTimeString.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}

export function formatDate(dateString: string) {
  // Parse the input date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }

  // Convert to the desired format
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  // Get the formatted date string
  const formattedDate = date.toLocaleString('en-IN', options);

  // Replace the time part to ensure it ends with 00:00:00
  return formattedDate.replace(
    /\d{1,2}:\d{2}:\d{2} (AM|PM)/,
    '00:00:00 GMT+0530 (India Standard Time)'
  );
}

export function convertDate(dateString: string) {
  let date;

  // Check if the input format is "YYYY-MM-DD HH:MM:SS +0000 +0000"
  if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+\d{4} \+\d{4}/.test(dateString)) {
    // Parse the input date string to create a Date object
    const parts = dateString.split(' ');
    const datePart = parts[0]; // "YYYY-MM-DD"
    date = new Date(datePart + 'T' + parts[1] + '+0000'); // Convert to ISO format
  } else {
    // Parse the input date string in "YYYY-MM-DD" format
    date = new Date(dateString);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error(
      'Invalid date format. Please use YYYY-MM-DD or YYYY-MM-DD HH:MM:SS +0000 +0000.'
    );
  }

  // Convert to the desired format
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  // Get the formatted date string
  const formattedDate = date.toLocaleString('en-IN', options);

  // Replace the time part to ensure it ends with 00:00:00 GMT+0530 (India Standard Time)
  return formattedDate.replace(
    /\d{1,2}:\d{2}:\d{2} (AM|PM)/,
    '00:00:00 GMT+0530 (India Standard Time)'
  );
}
