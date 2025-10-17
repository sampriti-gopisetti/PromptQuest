import { useState } from 'react';
import { LevelNode } from './LevelNode';
import { DataPath } from './DataPath';
import { toast } from 'sonner';

interface Level {
  id: number;
  position: { x: number; y: number };
  state: 'locked' | 'active' | 'completed';
  type: 'normal' | 'boss';
  scale: number;
}

export const AbyssMap = () => {
  // Generate levels in a spiral pattern ascending upward
  const generateLevels = (): Level[] => {
    const levels: Level[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 200;
    const verticalOffset = 150;

    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
      const layer = Math.floor(i / 4);
      const x = centerX + Math.cos(angle) * (radius + layer * 100);
      const y = centerY + Math.sin(angle) * (radius * 0.6 + layer * 80) + layer * verticalOffset;
      const scale = 1 - layer * 0.15; // Smaller as they go up

      levels.push({
        id: i + 1,
        position: { x, y },
        state: i === 0 ? 'completed' : i === 1 ? 'active' : 'locked',
        type: (i + 1) % 4 === 0 ? 'boss' : 'normal',
        scale,
      });
    }

    return levels;
  };

  const [levels, setLevels] = useState<Level[]>(generateLevels());
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const handleNodeClick = (level: Level) => {
    if (level.state === 'locked') {
      toast.error('This level is locked', {
        description: 'Complete previous levels to unlock.',
      });
      return;
    }

    if (level.state === 'active') {
      toast.success(`Entering Level ${level.id}`, {
        description: level.type === 'boss' ? 'Boss Challenge!' : 'Standard Challenge',
      });
      // Here you would transition to the challenge screen
      return;
    }

    toast.info(`Level ${level.id} already completed`, {
      description: 'Replay to improve your score.',
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Data paths connecting nodes */}
      {levels.map((level, index) => {
        if (index === 0) return null;
        const prevLevel = levels[index - 1];
        return (
          <DataPath
            key={`path-${level.id}`}
            from={prevLevel.position}
            to={level.position}
            isActive={level.state !== 'locked'}
          />
        );
      })}

      {/* Level nodes */}
      {levels.map((level) => (
        <LevelNode
          key={level.id}
          level={level.id}
          state={level.state}
          type={level.type}
          position={level.position}
          scale={level.scale}
          onClick={() => handleNodeClick(level)}
          onHover={(isHovered) => setHoveredNode(isHovered ? level.id : null)}
        />
      ))}

      {/* Title */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <h1
          className="text-8xl font-bold text-primary/10 animate-chromatic"
          style={{ fontFamily: 'monospace', letterSpacing: '0.2em' }}
        >
          DATA ABYSS
        </h1>
      </div>
    </div>
  );
};
