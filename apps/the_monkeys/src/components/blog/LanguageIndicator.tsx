import { getLanguageFlag } from '@/utils/languageDetection';

interface LanguageIndicatorProps {
  languageCode: string;
  languageName: string;
  confidence: number;
  className?: string;
}

export const LanguageIndicator = ({
  languageCode,
  languageName,
  confidence,
  className = '',
}: LanguageIndicatorProps) => {
  // Only show if confidence is reasonably high and it's not unknown
  if (languageCode === 'unknown' || confidence < 0.2) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-1 text-xs sm:text-sm opacity-75 ${className}`}
    >
      <span
        className='text-sm'
        title={`Detected with ${Math.round(confidence * 100)}% confidence`}
      >
        {getLanguageFlag(languageCode)}
      </span>
      <span className='font-medium'>{languageName}</span>
    </div>
  );
};
