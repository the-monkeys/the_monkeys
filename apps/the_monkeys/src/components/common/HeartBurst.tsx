import { CSSProperties } from 'react';

import Icon from '@/components/icon';

const particles = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * Math.PI * 2) / 8;
  const distance = 18 + Math.random() * 8;

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    r: Math.random() * 40 - 20,
    size: 6 + Math.floor(Math.random() * 3),
  };
});
export default function HeartBurst() {
  return (
    <span className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center'>
      {particles.map((particle, index) => (
        <span
          key={index}
          className='heart-burst-particle'
          style={
            {
              '--x': `${particle.x}px`,
              '--y': `${particle.y}px`,
              '--r': `${particle.r}deg`,
              animationDelay: `${8 + index * 10}ms`,
              opacity: 0.7 + Math.random() * 0.3,
            } as CSSProperties
          }
        >
          <Icon
            name='RiHeart3'
            type='Fill'
            size={particle.size}
            className='text-brand-orange'
          />
        </span>
      ))}
    </span>
  );
}
