import { Building2D } from './Building2D';
import { useGameState } from '@/hooks/useGameState';

interface CityMap2DProps {
  onBossClick: () => void;
  onLevelClick: (level: number) => void;
}

export const CityMap2D = ({ onBossClick, onLevelClick }: CityMap2DProps) => {
  const { currentLevel, completedLevels } = useGameState();

  // Position buildings in a city grid layout
  const getCityPosition = (level: number): { x: number; y: number } => {
    const centerX = 400;
    const centerY = 350;
    
    // Arrange in a winding path through the city
    const angle = ((level - 1) / 10) * Math.PI * 2.5;
    const radius = 80 + (level - 1) * 30;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    return { x, y };
  };

  const handleBuildingClick = (level: number) => {
    if (level === 10 && completedLevels.includes(9)) {
      onBossClick();
    } else if (level === currentLevel) {
      onLevelClick(level);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background - colorful city ground */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-300 via-green-400 to-green-500">
        {/* Decorative grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Roads connecting buildings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {Array.from({ length: 9 }, (_, i) => {
          const start = getCityPosition(i + 1);
          const end = getCityPosition(i + 2);
          return (
            <g key={`road-${i}`}>
              {/* Road path */}
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#6B7280"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Road markings */}
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#FCD34D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="8 8"
              />
            </g>
          );
        })}
      </svg>

      {/* Decorative trees */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 100 + (i % 3) * 80;
        const x = 400 + Math.cos(angle) * radius;
        const y = 350 + Math.sin(angle) * radius;
        const size = 20 + (i % 3) * 5;
        
        return (
          <div
            key={`tree-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            {/* Tree trunk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-amber-900 rounded-sm" />
            {/* Tree foliage */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: ['#2D5016', '#3A6B1F', '#458B2A'][i % 3],
              }}
            />
          </div>
        );
      })}

      {/* Buildings */}
      <div className="relative" style={{ zIndex: 10 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const level = i + 1;
          const position = getCityPosition(level);
          const isLocked = level > currentLevel;
          const isActive = level === currentLevel;
          const isCompleted = completedLevels.includes(level);
          const isBoss = level === 10;

          return (
            <Building2D
              key={level}
              level={level}
              position={position}
              isLocked={isLocked}
              isActive={isActive}
              isCompleted={isCompleted}
              isBoss={isBoss}
              onClick={() => handleBuildingClick(level)}
            />
          );
        })}
      </div>

      {/* Title overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none" style={{ zIndex: 20 }}>
        <h1 className="text-6xl font-bold text-white drop-shadow-lg" style={{ textShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}>
          PROMPT QUEST
        </h1>
        <p className="text-xl text-white/90 mt-2 drop-shadow">Complete levels to reach the boss!</p>
      </div>
    </div>
  );
};
