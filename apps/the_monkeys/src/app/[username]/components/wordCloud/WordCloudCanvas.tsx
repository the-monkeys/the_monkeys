import React, { useEffect, useRef, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@the-monkeys/ui/atoms/button';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface WordCloudCanvasProps {
  tags: Record<string, number>;
  username: string;
}

const WordCloudCanvas: React.FC<WordCloudCanvasProps> = ({
  tags,
  username,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [words, setWords] = useState<cloud.Word[]>([]);
  const [loading, setLoading] = useState(true);

  const baseWidth = 1080;
  const baseHeight = Math.round((baseWidth * 2) / 3);

  // Generate word positions
  useEffect(() => {
    if (!tags || Object.keys(tags).length === 0) return;
    setLoading(true);

    const values = Object.values(tags);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const wordsData = Object.entries(tags).map(([text, value]) => {
      let size: number;

      if (min === max) {
        size = 40;
      } else {
        const scale = (value - min) / (max - min);
        size = 20 + scale * 40;
      }

      return { text, size, value };
    });

    const paddingX = 40;
    const paddingY = 40;

    const layout = cloud<cloud.Word>()
      .size([baseWidth - paddingX, baseHeight - paddingY])
      .words(wordsData as cloud.Word[])
      .padding(8)
      .rotate(0)
      .fontSize((d: any) => d.size)
      .on('end', (output: cloud.Word[]) => {
        setWords(output);
        setLoading(false);
      });

    setTimeout(() => {
      layout.start();
    }, 800);
  }, [tags]);

  // Draw words
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || words.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const values = words.map((w: any) => w.value || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const colorScale = d3
      .scaleLinear<string>()
      .domain([min, max])
      .range(['#ff5d4d', '#ff5542']);

    words.forEach((word) => {
      ctx.save();
      ctx.translate(word.x || 0, word.y || 0);
      ctx.rotate(((word.rotate || 0) * Math.PI) / 180);
      ctx.textAlign = 'center';
      ctx.font = `600 ${word.size}px sans-serif`;
      ctx.fillStyle = colorScale((word as any).value || 0);
      if (word.text) {
        ctx.fillText(word.text, 0, 0);
      }
      ctx.restore();
    });

    ctx.restore();
  }, [words]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    tempCtx.fillStyle = '#1e1e1e';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `${username}-wordcloud.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className='h-full flex flex-col gap-4 items-center'>
      {loading ? (
        <div className='h-[200px] w-full flex flex-col items-center justify-center gap-3'>
          <Loader size={40} className='text-brand-orange' />
          <p>Generating word cloud...</p>
        </div>
      ) : (
        <>
          <div className='w-full max-w-[720px] aspect-[3/2] border-1 rounded-md border-border-light dark:border-border-dark'>
            <canvas
              ref={canvasRef}
              width={baseWidth}
              height={baseHeight}
              className='w-full h-full block'
            />
          </div>

          <div className='mx-auto'>
            <Button
              className='flex items-center gap-2 shadow-sm'
              onClick={handleDownload}
              disabled={loading}
            >
              <Icon name='RiDownload2' size={18} />
              <p>Save</p>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WordCloudCanvas;
