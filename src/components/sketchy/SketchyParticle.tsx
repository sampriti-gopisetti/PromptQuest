import { useEffect, useState } from 'react';

interface SketchyParticleProps {
  position: { x: number; y: number };
  type: 'confetti' | 'dust' | 'sparkle' | 'star';
  onComplete?: () => void;
}

export const SketchyParticle = ({ position, type, onComplete }: SketchyParticleProps) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (type === 'confetti') {
        setOffset({
          x: (Math.random() - 0.5) * 100 * progress,
          y: progress * 150 - 50
        });
      } else if (type === 'dust') {
        setOffset({
          x: (Math.random() - 0.5) * 50 * progress,
          y: -progress * 30
        });
      } else if (type === 'sparkle' || type === 'star') {
        setOffset({
          x: (Math.random() - 0.5) * 60 * progress,
          y: -progress * 80
        });
      }

      setOpacity(1 - progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };

    animate();
  }, [type, onComplete]);

  const getParticleShape = () => {
    switch (type) {
      case 'confetti':
        return (
          <div
            className="border-2 border-black"
            style={{
              width: '8px',
              height: '12px',
              background: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77', '#FF8DC7'][Math.floor(Math.random() * 5)],
              transform: `rotate(${Math.random() * 360}deg)`,
              filter: 'url(#sketch-outline)'
            }}
          />
        );
      case 'dust':
        return (
          <div
            className="rounded-full border border-gray-400"
            style={{
              width: '10px',
              height: '10px',
              background: '#D1D5DB',
              filter: 'url(#sketch-outline) blur(1px)'
            }}
          />
        );
      case 'sparkle':
        return (
          <div className="text-yellow-400 text-xl" style={{ filter: 'url(#sketch-wobble)' }}>
            ✨
          </div>
        );
      case 'star':
        return (
          <div className="text-yellow-400 text-2xl" style={{ filter: 'url(#sketch-wobble)' }}>
            ⭐
          </div>
        );
    }
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${position.x + offset.x}px`,
        top: `${position.y + offset.y}px`,
        opacity,
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        transition: 'none'
      }}
    >
      {getParticleShape()}
    </div>
  );
};
