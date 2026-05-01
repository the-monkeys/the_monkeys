import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocale = () => {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language || 'en';
};

export const formatCount = (num: number) =>
  new Intl.NumberFormat(getLocale(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
