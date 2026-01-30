'use client';

import React, { useEffect, useState } from 'react';

import Image, { ImageProps } from 'next/image';

import { decodeBlurHashToDataURL } from '@/utils/blurhash';
import { twMerge } from 'tailwind-merge';

interface SmartImageProps
  extends Omit<ImageProps, 'placeholder' | 'blurDataURL' | 'onLoad'> {
  blurHash?: string;
  containerClassName?: string;
}

/**
 * SmartImage Component
 * A premium image component that handles:
 * 1. Immediate BlurHash placeholder display
 * 2. Smooth cross-fade transition to full-res image (Google-style)
 * 3. Zero layout shift
 */
export const SmartImage = ({
  src,
  alt,
  blurHash,
  containerClassName,
  className,
  ...props
}: SmartImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (blurHash) {
      const url = decodeBlurHashToDataURL(blurHash);
      setBlurDataURL(url);
    }
  }, [blurHash]);

  return (
    <div
      className={twMerge(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-900',
        containerClassName
      )}
    >
      {/* Layer 1: BlurHash Placeholder (Visible until main image fades in) */}
      {blurDataURL && (
        <div
          className={twMerge(
            'absolute inset-0 z-0 transition-opacity duration-700 ease-in-out',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Layer 2: Main Image */}
      <Image
        src={src}
        alt={alt}
        className={twMerge(
          'relative z-10 w-full h-full object-cover transition-opacity duration-700 ease-out',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setIsLoaded(true);
          if (props.onError) props.onError(e);
        }}
        {...(blurDataURL ? { placeholder: 'blur', blurDataURL } : {})}
        {...props}
      />
    </div>
  );
};

export default SmartImage;
