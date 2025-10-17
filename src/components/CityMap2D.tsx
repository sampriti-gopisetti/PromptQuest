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

  // Initialize character position
  useEffect(() => {
    const initialPos = getSnakePosition(Math.max(1, currentLevel));
    setCharacterPos(initialPos);
  }, [currentLevel]);

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
    <div className="relative w-full h-screen overflow-auto" style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F2FE 50%, #B4E7CE 100%)' }}>
      <SketchFilter />

      {/* Decorative clouds */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`cloud-${i}`}
          className="absolute text-white text-6xl opacity-70"
          style={{
            left: `${20 + i * 20}%`,
            top: `${5 + Math.random() * 10}%`,
            filter: 'url(#sketch-wobble)',
            animation: `float ${10 + i * 2}s infinite ease-in-out`
          }}
        >
          ☁️
        </div>
      ))}

      {/* Flying birds */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`bird-${i}`}
          className="absolute text-gray-700 text-2xl"
          style={{
            left: `${-10 + i * 30}%`,
            top: `${10 + i * 5}%`,
            filter: 'url(#sketch-outline)',
            animation: `float ${5 + i}s infinite linear`,
            animationDelay: `${i * 2}s`
          }}
        >
          🦅
        </div>
      ))}

      {/* Game title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <h1 
          className="text-5xl font-bold text-white drop-shadow-lg border-4 border-black bg-blue-500 px-8 py-3 rounded-lg"
          style={{ filter: 'url(#sketch-outline)', transform: 'rotate(-2deg)' }}
        >
          PROMPT QUEST
        </h1>
      </div>

      {/* Main game area */}
      <div className="relative w-full" style={{ minHeight: '800px', paddingBottom: '100px' }}>
        {/* Ground with grass texture */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #48BB78 0%, #38A169 50%, #2F855A 100%)',
            minHeight: '100%'
          }}
        >
          {/* Grass stipple effect */}
          <div className="absolute inset-0" style={{ background: 'url(#stipple-grass)', opacity: 0.3 }} />
        </div>

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

              {/* Trees around each building */}
              <SketchyTree2D
                position={{ x: position.x + 50, y: position.y + 30 }}
                scale={0.8}
                type="oak"
              />
              <SketchyTree2D
                position={{ x: position.x - 45, y: position.y + 35 }}
                scale={0.7}
                type="pine"
              />
              {level % 3 === 0 && (
                <SketchyTree2D
                  position={{ x: position.x + 30, y: position.y - 40 }}
                  scale={0.9}
                  type="palm"
                />
              )}
            </div>
          );
        })}

        {/* Additional decorative trees */}
        <SketchyTree2D position={{ x: 100, y: 400 }} scale={1.2} type="oak" />
        <SketchyTree2D position={{ x: 600, y: 350 }} scale={1.1} type="pine" />
        <SketchyTree2D position={{ x: 150, y: 200 }} scale={0.9} type="palm" />

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
  );
};
