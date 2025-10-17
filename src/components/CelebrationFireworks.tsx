import { useEffect, useState } from 'react';

interface CelebrationFireworksProps {
  onComplete: () => void;
}

export const CelebrationFireworks = ({ onComplete }: CelebrationFireworksProps) => {
  const [fireworks, setFireworks] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    // Generate multiple fireworks
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2'];
    const newFireworks = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60, // Random x position (20-80%)
      y: 10 + Math.random() * 40, // Random y position (10-50%)
      color: colors[i % colors.length],
      delay: i * 150
    }));
    
    setFireworks(newFireworks);

    // Complete after all fireworks are done
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" style={{ background: 'transparent' }}>
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            animationDelay: `${firework.delay}ms`
          }}
        >
          {/* Central burst */}
          <div
            className="absolute w-4 h-4 rounded-full animate-ping"
            style={{
              backgroundColor: firework.color,
              boxShadow: `0 0 20px ${firework.color}`,
              animationDuration: '1s'
            }}
          />
          
          {/* Particle explosions */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const distance = 40 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: firework.color,
                  boxShadow: `0 0 10px ${firework.color}`,
                  animation: 'explode 1s ease-out forwards',
                  animationDelay: `${firework.delay}ms`,
                  '--explode-x': `${x}px`,
                  '--explode-y': `${y}px`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      ))}
      
      {/* Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute text-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-50px',
            animation: 'fall 2s linear forwards',
            animationDelay: `${i * 50}ms`,
            opacity: 0.8
          }}
        >
          {['🎊', '🎉', '⭐', '✨', '🌟'][i % 5]}
        </div>
      ))}
      
      <style>{`
        @keyframes explode {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--explode-x), var(--explode-y)) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};