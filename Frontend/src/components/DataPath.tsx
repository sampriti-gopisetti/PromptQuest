import { useEffect, useRef } from 'react';

interface DataPathProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive: boolean;
}

export const DataPath = ({ from, to, isActive }: DataPathProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    canvas.width = Math.abs(dx) + 100;
    canvas.height = Math.abs(dy) + 100;

    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = dx > 0 ? 50 : canvas.width - 50;
      const startY = dy > 0 ? 50 : canvas.height - 50;
      const endX = dx > 0 ? canvas.width - 50 : 50;
      const endY = dy > 0 ? canvas.height - 50 : 50;

      // Draw glowing path
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
      gradient.addColorStop(0.5, isActive ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      if (isActive) {
        // Draw flowing particles
        const particleCount = Math.floor(distance / 50);
        for (let i = 0; i < particleCount; i++) {
          const progress = ((i / particleCount + offset) % 1);
          const x = startX + (endX - startX) * progress;
          const y = startY + (endY - startY) * progress;

          const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
          particleGradient.addColorStop(0, 'rgba(59, 130, 246, 1)');
          particleGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

          ctx.fillStyle = particleGradient;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        offset += 0.01;
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [from, to, isActive]);

  const left = Math.min(from.x, to.x) - 50;
  const top = Math.min(from.y, to.y) - 50;

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        mixBlendMode: 'screen',
      }}
    />
  );
};
