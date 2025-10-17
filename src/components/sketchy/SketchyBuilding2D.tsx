import { Lock, Crown, CheckCircle2 } from 'lucide-react';

interface SketchyBuilding2DProps {
  level: number;
  position: { x: number; y: number };
  isLocked: boolean;
  isActive: boolean;
  isCompleted: boolean;
  isBoss: boolean;
  onClick: () => void;
}

const buildingColors = [
  '#FFB6C1', '#FFD700', '#98FB98', '#87CEEB', 
  '#DDA0DD', '#F0E68C', '#FFB347', '#FF69B4',
  '#BA55D3', '#FF4500'
];

export const SketchyBuilding2D = ({
  level,
  position,
  isLocked,
  isActive,
  isCompleted,
  isBoss,
  onClick
}: SketchyBuilding2DProps) => {
  const getColor = () => {
    if (isLocked) return '#9CA3AF';
    if (isCompleted) return '#34D399';
    if (isActive) return '#60A5FA';
    return buildingColors[(level - 1) % buildingColors.length];
  };

  const getBuildingType = () => {
    if (isBoss) return 'skyscraper';
    if (level >= 7) return 'office';
    if (level >= 5) return 'apartment';
    if (level >= 3) return 'shop';
    return 'house';
  };

  const type = getBuildingType();
  const color = getColor();
  const baseSize = type === 'skyscraper' ? 60 : type === 'office' ? 50 : type === 'apartment' ? 45 : type === 'shop' ? 40 : 35;
  const height = type === 'skyscraper' ? 80 : type === 'office' ? 60 : type === 'apartment' ? 50 : type === 'shop' ? 40 : 35;

  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.floor(position.y)
      }}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Isometric building container */}
      <div className="relative" style={{ width: `${baseSize}px`, height: `${height + 30}px` }}>
        {/* Shadow - sketchy oval */}
        <div
          className="absolute opacity-30"
          style={{
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${baseSize + 10}px`,
            height: '8px',
            background: '#000',
            borderRadius: '50%',
            filter: 'url(#sketch-outline) blur(3px)'
          }}
        />

        {/* Isometric building body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ transformStyle: 'preserve-3d' }}>
          {/* Front face */}
          <div
            className="relative border-2 border-black"
            style={{
              width: `${baseSize}px`,
              height: `${height}px`,
              background: color,
              transform: 'rotateX(60deg) rotateZ(-45deg)',
              transformOrigin: 'bottom',
              filter: 'url(#sketch-outline)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
              borderRadius: '2px'
            }}
          >
            {/* Cross-hatch shading on left side */}
            <div
              className="absolute left-0 top-0 bottom-0 w-2"
              style={{
                background: 'url(#crosshatch-dark)',
                opacity: 0.5
              }}
            />

            {/* Windows */}
            {type !== 'house' && (
              <div className="p-2 grid grid-cols-3 gap-1">
                {Array.from({ length: type === 'skyscraper' ? 18 : type === 'office' ? 12 : 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-black/20 border border-black"
                    style={{
                      width: '6px',
                      height: '8px',
                      filter: 'url(#sketch-outline)',
                      transform: `rotate(${Math.random() * 2 - 1}deg)`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Door for houses */}
            {type === 'house' && (
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-amber-900 border-2 border-black"
                style={{
                  width: '10px',
                  height: '15px',
                  filter: 'url(#sketch-outline)',
                  borderRadius: '2px 2px 0 0'
                }}
              />
            )}
          </div>

          {/* Top face (roof) */}
          <div
            className="absolute border-2 border-black"
            style={{
              width: `${baseSize}px`,
              height: `${baseSize * 0.5}px`,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              transform: `translateY(-${height}px) rotateX(60deg) rotateZ(-45deg) translateZ(1px)`,
              transformOrigin: 'bottom',
              filter: 'url(#sketch-outline)',
              borderRadius: '2px'
            }}
          >
            {/* Roof details for houses */}
            {type === 'house' && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-8 bg-red-800 border border-black"
                style={{ filter: 'url(#sketch-outline)' }}
              />
            )}
          </div>

          {/* Boss building special effects */}
          {isBoss && (
            <>
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400 animate-pulse"
                style={{ filter: 'url(#sketch-wobble)' }}
              >
                <Crown size={24} />
              </div>
              {/* Lightning bolts */}
              <div className="absolute -left-2 top-1/2 text-yellow-300 animate-pulse">
                ⚡
              </div>
              <div className="absolute -right-2 top-1/3 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }}>
                ⚡
              </div>
            </>
          )}
        </div>

        {/* Level indicator */}
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center font-bold text-sm"
          style={{ filter: 'url(#sketch-outline)' }}
        >
          {level}
        </div>

        {/* Status icons */}
        {isLocked && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 bg-white/80 rounded-full p-1 border-2 border-black" style={{ filter: 'url(#sketch-outline)' }}>
            <Lock size={20} />
          </div>
        )}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 text-green-500 bg-white rounded-full p-1 border-2 border-black" style={{ filter: 'url(#sketch-outline)' }}>
            <CheckCircle2 size={16} />
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-500 animate-bounce"
            style={{ filter: 'url(#sketch-wobble)' }}
          >
            ⬇️
          </div>
        )}
      </div>
    </div>
  );
};
