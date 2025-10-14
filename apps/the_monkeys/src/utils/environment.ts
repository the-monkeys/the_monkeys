export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isQA = (): boolean => {
  // Check if we're in QA or preview environment
  return (
    typeof window !== 'undefined' &&
    window.location.href.includes('deploy-preview')
  );
};

export const shouldLoadAnalytics = (): boolean => {
  // Only load analytics (Clarity, AdSense) in production
  return isProduction() && !isQA();
};

export const shouldLoadAdSense = (): boolean => {
  // Only load AdSense in production
  return isProduction() && !isQA();
};
