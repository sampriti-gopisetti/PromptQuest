import { SketchFilter } from './sketchy/SketchFilter';
import { SketchyBuilding2D } from './sketchy/SketchyBuilding2D';
import { SketchyTree2D } from './sketchy/SketchyTree2D';
import { SketchyRoad2D } from './sketchy/SketchyRoad2D';
import { SketchyCharacter2D } from './sketchy/SketchyCharacter2D';
import { SketchyParticle } from './sketchy/SketchyParticle';
import { useGameState } from '@/hooks/useGameState';
import { useState, useEffect } from 'react';

interface CityMap2DProps {
  onBossClick: () => void;
  onLevelClick: (level: number) => void;
}

export const CityMap2D = ({ onBossClick, onLevelClick }: CityMap2DProps) => {
  const { currentLevel, completedLevels } = useGameState();
  const [characterPos, setCharacterPos] = useState({ x: 0, y: 0 });
  const [characterState, setCharacterState] = useState<'idle' | 'running' | 'entering' | 'celebrating'>('idle');
  const [characterDirection, setCharacterDirection] = useState<'left' | 'right'>('right');
  const [particles, setParticles] = useState<Array<{ id: number; pos: { x: number; y: number }; type: 'confetti' | 'dust' | 'sparkle' | 'star' }>>([]);

  // Horizontal snake path positions
  const getSnakePosition = (level: number): { x: number; y: number } => {
    const colWidth = 180; // Wider spacing for horizontal layout
    const rowHeight = 160; // More vertical spacing
    const row = Math.floor((level - 1) / 5); // 5 buildings per row
    const col = (level - 1) % 5;
    
    // Alternate direction per row (snake pattern) - horizontal
    const x = row % 2 === 0 
      ? 200 + col * colWidth 
      : 200 + (4 - col) * colWidth;
    const y = 200 + row * rowHeight; // Start from top
    
    return { x, y };
  };

  // Initialize character position - Always start at Level 1
  useEffect(() => {
    const initialPos = getSnakePosition(1);
    setCharacterPos(initialPos);
  }, []);

  const handleBuildingClick = (level: number) => {
    if (level === 10 && completedLevels.includes(9)) {
      moveCharacterToBuilding(level, onBossClick);
    } else if (level === currentLevel) {
      moveCharacterToBuilding(level, () => onLevelClick(level));
    }
  };

  const moveCharacterToBuilding = (level: number, callback: () => void) => {
    const targetPos = getSnakePosition(level);
    setCharacterDirection(targetPos.x > characterPos.x ? 'right' : 'left');
    setCharacterState('running');

    // Create dust particles during movement
    const dustInterval = setInterval(() => {
      setParticles(prev => [...prev, {
        id: Date.now() + Math.random(),
        pos: { ...characterPos },
        type: 'dust'
      }]);
    }, 100);

    // Move character
    setTimeout(() => {
      setCharacterPos(targetPos);
      
      setTimeout(() => {
        clearInterval(dustInterval);
        setCharacterState('entering');
        
        setTimeout(() => {
          callback();
          setCharacterState('celebrating');
          
          // Create celebration particles
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              setParticles(prev => [...prev, {
                id: Date.now() + Math.random(),
                pos: targetPos,
                type: Math.random() > 0.5 ? 'confetti' : 'sparkle'
              }]);
            }, i * 100);
          }
          
          setTimeout(() => {
            setCharacterState('idle');
          }, 1500);
        }, 500);
      }, 2000);
    }, 100);
  };

  const removeParticle = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8F4 30%, #F5E6D3 70%, #98FB98 100%)' }}>
      <SketchFilter />

      {/* Decorative clouds */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute text-white text-5xl opacity-80 drop-shadow-lg"
          style={{
            left: `${10 + i * 12}%`,
            top: `${3 + (i % 3) * 8}%`,
            filter: 'url(#sketch-wobble)',
            animation: `float ${8 + i * 1.5}s infinite ease-in-out`,
            zIndex: 5
          }}
        >
          ☁️
        </div>
      ))}

      {/* Flying birds */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`bird-${i}`}
          className="absolute text-gray-800 text-2xl"
          style={{
            left: `${-10 + i * 25}%`,
            top: `${8 + i * 4}%`,
            filter: 'url(#sketch-outline)',
            animation: `float ${6 + i}s infinite linear`,
            animationDelay: `${i * 1.5}s`,
            zIndex: 5
          }}
        >
          🦅
        </div>
      ))}

      {/* Sun */}
      <div
        className="absolute text-yellow-400 text-7xl"
        style={{
          right: '10%',
          top: '5%',
          filter: 'url(#sketch-wobble) drop-shadow(0 0 30px rgba(255,255,0,0.6))',
          zIndex: 5
        }}
      >
        ☀️
      </div>

      {/* Main game area - Scrollable container */}
      <div className="relative w-full h-full overflow-y-auto">
        <div className="relative w-full" style={{ minHeight: '900px', paddingTop: '150px', paddingBottom: '100px' }}>
          {/* Decorative flowers scattered in grass */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`flower-${i}`}
              className="absolute text-3xl"
              style={{
                left: `${5 + i * 6}%`,
                top: `${60 + (i % 5) * 8}%`,
                filter: 'url(#sketch-wobble)',
                animation: `float ${6 + (i % 3) * 2}s infinite ease-in-out`,
                animationDelay: `${i * 0.3}s`,
                zIndex: 3
              }}
            >
              {['🌸', '🌺', '🌻', '🌼', '🌷'][i % 5]}
            </div>
          ))}

          {/* Roads connecting buildings in snake pattern */}
          {Array.from({ length: 9 }, (_, i) => {
            const start = getSnakePosition(i + 1);
            const end = getSnakePosition(i + 2);
            return <SketchyRoad2D key={`road-${i}`} start={start} end={end} width={35} />;
          })}

          {/* Buildings */}
          {Array.from({ length: 10 }, (_, i) => {
          const level = i + 1;
          const position = getSnakePosition(level);
          const isLocked = level > currentLevel;
          const isActive = level === currentLevel;
          const isCompleted = completedLevels.includes(level);
          const isBoss = level === 10;

            return (
              <div key={level}>
                <SketchyBuilding2D
                  level={level}
                  position={position}
                  isLocked={isLocked}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  isBoss={isBoss}
                  onClick={() => handleBuildingClick(level)}
                />
              </div>
            );
          })}

          {/* Character */}
          <SketchyCharacter2D
            position={characterPos}
            state={characterState}
            direction={characterDirection}
          />

          {/* Particles */}
          {particles.map(particle => (
            <SketchyParticle
              key={particle.id}
              position={particle.pos}
              type={particle.type}
              onComplete={() => removeParticle(particle.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
