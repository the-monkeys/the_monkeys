'use client';

import { useMemo } from 'react';

import Link from 'next/link';

interface WordData {
  word: string;
  popularity: number;
}

const hardcodedWords: WordData[] = [
  { word: 'BOCCHI THE ROCK!', popularity: 45 },
  { word: 'Zenless Zone Zero', popularity: 38 },
  { word: 'Aenami', popularity: 32 },
  { word: 'illustration', popularity: 28 },
  { word: 'dark background', popularity: 25 },
  { word: 'Makima (Chainsaw Man)', popularity: 42 },
  { word: 'pixel art', popularity: 35 },
  { word: 'nature', popularity: 30 },
  { word: 'WLOP', popularity: 22 },
  { word: 'manga', popularity: 20 },
  { word: 'anime boys', popularity: 18 },
  { word: 'One Piece', popularity: 40 },
  { word: 'Japan', popularity: 26 },
  { word: 'monochrome', popularity: 15 },
  { word: 'abstract', popularity: 33 },
  { word: 'Wuthering Waves', popularity: 29 },
  { word: 'black background', popularity: 24 },
  { word: 'fantasy art', popularity: 37 },
  { word: 'femboy', popularity: 12 },
  { word: 'skinny', popularity: 10 },
  { word: 'photography', popularity: 31 },
  { word: 'Studio Ghibli', popularity: 41 },
  { word: 'Air India', popularity: 24 },
  { word: 'cyberpunk', popularity: 36 },
  { word: 'minimalism', popularity: 19 },
  { word: 'retro', popularity: 21 },
  { word: 'synthwave', popularity: 27 },
  { word: 'digital art', popularity: 39 },
];

function getTextSizeClass(popularity: number): string {
  if (popularity >= 40) return 'text-xl';
  if (popularity >= 30) return 'text-lg';
  if (popularity >= 20) return 'text-sm';
  return 'text-sm';
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TrendingCategories() {
  const shuffledWords = useMemo(() => shuffleArray(hardcodedWords), []);

  return (
    <div className='bg-transparent p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* <h2 className='text-2xl font-bold text-white text-center mb-2'>
          Trending Categories
        </h2> */}
        <div className='flex flex-wrap gap-3 justify-center items-center'>
          {shuffledWords.map((item, index) => (
            <Link href={`/feed#${item}`} key={index}>
              <span
                key={index}
                className={`
                ${getTextSizeClass(item.popularity)}
                text-orange-400 
                hover:text-orange-600 
                transition-colors 
                duration-200 
                cursor-pointer
                font-medium
                whitespace-nowrap
                `}
                title={`Popularity: ${item.popularity}`}
              >
                #{item.word}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
