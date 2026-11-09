import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isActive: boolean;
  volume?: number;
  barCount?: number;
  height?: number;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive,
  volume = 0,
  barCount = 32,
  height = 50,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const ch = canvas.height;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        // Calculate dynamic bar height using sine phase & volume
        let barHeight = 4;
        if (isActive) {
          const wave1 = Math.sin(phase + (i / barCount) * Math.PI * 4);
          const wave2 = Math.cos(phase * 1.5 + (i / barCount) * Math.PI * 2);
          const intensity = Math.max(0.15, volume);
          barHeight = Math.max(6, Math.abs(wave1 * 0.6 + wave2 * 0.4) * ch * intensity * 0.85);
        }

        const x = i * (barWidth + 2);
        const y = (ch - barHeight) / 2;

        // Gradient coloring from Cyan to Violet
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#22D3EE');
        grad.addColorStop(0.5, '#3B82F6');
        grad.addColorStop(1, '#8B5CF6');

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Rounded bar
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += isActive ? 0.08 : 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, volume, barCount, height]);

  return (
    <div className={`flex items-center justify-center w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={320}
        height={height}
        className="w-full max-w-sm h-12"
      />
    </div>
  );
};

