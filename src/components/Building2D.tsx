import { Lock, Crown, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Building2DProps {
  level: number;
  position: { x: number; y: number };
  isLocked: boolean;
  isActive: boolean;
  isCompleted: boolean;
  isBoss: boolean;
  onClick: () => void;
}

const buildingColors = [
  '#FFB6C1', // Pink
  '#90EE90', // Light green
  '#87CEEB', // Sky blue  
  '#FFE4B5', // Peach
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#FFA07A', // Light salmon
  '#98FB98', // Pale green
  '#DEB887', // Burlywood
  '#A855F7', // Purple (boss)
];

export const Building2D = ({
  level,
  position,
  isLocked,
  isActive,
  isCompleted,
  isBoss,
  onClick,
}: Building2DProps) => {
  const getColor = () => {
    if (isLocked) return '#9CA3AF';
    if (isCompleted) return '#4ADE80';
    if (isActive) return '#FBBF24';
    return buildingColors[(level - 1) % buildingColors.length];
  };

  const getBuildingType = () => {
    if (isBoss) return 'skyscraper';
    if (level <= 2) return 'house';
    if (level <= 4) return 'shop';
    if (level <= 6) return 'apartment';
    return 'office';
  };

  const type = getBuildingType();
  const color = getColor();

  return (
    <div
      className={cn(
        "absolute transition-all duration-300 cursor-pointer group",
        isActive && "animate-pulse",
        isLocked && "opacity-60 cursor-not-allowed"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => !isLocked && onClick()}
    >
      {/* Building shadow */}
      <div
        className="absolute w-full h-full blur-sm opacity-30 rounded-lg"
        style={{
          backgroundColor: '#000',
          transform: 'translate(4px, 4px)',
          zIndex: -1,
        }}
      />

      {/* Main building */}
      <div
        className={cn(
          "relative rounded-lg border-2 border-black/20 transition-transform group-hover:scale-110",
          type === 'house' && "w-16 h-16",
          type === 'shop' && "w-20 h-20",
          type === 'apartment' && "w-24 h-24",
          type === 'office' && "w-28 h-28",
          type === 'skyscraper' && "w-32 h-32"
        )}
        style={{ backgroundColor: color }}
      >
        {/* Roof */}
        {type === 'house' && (
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[32px] border-r-[32px] border-b-[16px] border-transparent"
            style={{ borderBottomColor: color, filter: 'brightness(0.8)' }}
          />
        )}

        {/* Windows */}
        <div className="absolute inset-2 grid grid-cols-2 gap-1">
          {Array.from({ length: type === 'skyscraper' ? 12 : type === 'office' ? 8 : 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/80 rounded-sm border border-black/20"
              style={{ aspectRatio: '1' }}
            />
          ))}
        </div>

        {/* Door */}
        {type !== 'skyscraper' && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 rounded-t-lg"
            style={{ backgroundColor: color, filter: 'brightness(0.6)' }}
          />
        )}

        {/* Level number */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
          Level {level}
        </div>

        {/* Status icons */}
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 border-2 border-black/20">
          {isLocked && <Lock size={16} className="text-gray-500" />}
          {isBoss && !isCompleted && <Crown size={16} className="text-yellow-500" />}
          {isCompleted && <CheckCircle2 size={16} className="text-green-500" />}
        </div>
      </div>
    </div>
  );
};
