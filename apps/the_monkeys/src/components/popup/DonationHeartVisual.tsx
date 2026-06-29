'use client';

import { type CSSProperties, type MouseEvent, useRef, useState } from 'react';

type Tilt = {
  x: number;
  y: number;
};

const DonationHeartVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredFacet, setHoveredFacet] = useState<string | null>(null);
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });

  const handlePointerMove = (e: MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * 12, y: px * -12 });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredFacet(null);
  };

  const facetProps = (id: string, baseOpacity: number) => ({
    onMouseEnter: () => setHoveredFacet(id),
    onMouseLeave: () => setHoveredFacet(null),
    opacity:
      hoveredFacet === id ? Math.min(baseOpacity + 0.18, 1) : baseOpacity,
    style: {
      transition: 'opacity 200ms ease, transform 200ms ease',
      transform: hoveredFacet === id ? 'scale(1.03)' : 'scale(1)',
      transformBox: 'fill-box',
      transformOrigin: 'center',
      cursor: 'pointer',
    } as CSSProperties,
  });

  return (
    <div className='flex-1 min-w-0 relative flex justify-center items-center w-full max-w-[240px] sm:max-w-xs lg:max-w-sm mx-auto'>
      <svg
        ref={svgRef}
        viewBox='0 0 400 400'
        className='w-full h-auto drop-shadow-2xl'
        preserveAspectRatio='xMidYMid meet'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        style={{
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 150ms ease-out',
        }}
      >
        <defs>
          <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='4' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        <text
          x='95'
          y='90'
          textAnchor='middle'
          fill='#6B7280'
          fontSize='10'
          fontWeight='800'
          letterSpacing='0.1em'
        >
          OPEN-SOURCE
        </text>
        <text
          x='300'
          y='90'
          textAnchor='middle'
          fill='#6B7280'
          fontSize='10'
          fontWeight='800'
          letterSpacing='0.1em'
        >
          EDUCATION
        </text>
        <text
          x='200'
          y='340'
          textAnchor='middle'
          fill='#6B7280'
          fontSize='10'
          fontWeight='800'
          letterSpacing='0.1em'
        >
          RESEARCH
        </text>

        {/* Polygons */}
        <g stroke='#ffffff' strokeWidth='1.5' strokeLinejoin='round'>
          <polygon
            points='100,100 200,140 140,200'
            fill='#ea580c'
            {...facetProps('tl1', 0.85)}
          />
          <polygon
            points='100,100 140,200 60,170'
            fill='#f97316'
            {...facetProps('tl2', 0.7)}
          />

          <polygon
            points='300,100 260,200 200,140'
            fill='#ea580c'
            {...facetProps('tr1', 0.75)}
          />
          <polygon
            points='300,100 340,170 260,200'
            fill='#f97316'
            {...facetProps('tr2', 0.6)}
          />

          <polygon
            points='140,200 200,140 260,200'
            fill='#c2410c'
            {...facetProps('c1', 0.9)}
          />
          <polygon
            points='140,200 260,200 200,260'
            fill='#ea580c'
            {...facetProps('c2', 1.0)}
          />

          <polygon
            points='60,170 140,200 200,320'
            fill='#f97316'
            {...facetProps('bl1', 0.9)}
          />
          <polygon
            points='140,200 200,260 200,320'
            fill='#fb923c'
            {...facetProps('bl2', 0.85)}
          />

          <polygon
            points='340,170 200,320 260,200'
            fill='#ea580c'
            {...facetProps('br1', 0.8)}
          />
          <polygon
            points='260,200 200,320 200,260'
            fill='#f97316'
            {...facetProps('br2', 0.75)}
          />
        </g>
      </svg>
    </div>
  );
};

export default DonationHeartVisual;
