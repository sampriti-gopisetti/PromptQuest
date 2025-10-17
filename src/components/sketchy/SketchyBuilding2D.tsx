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
  
  // Progressive sizing based on level
  const sizeMultiplier = 1 + (level - 1) * 0.15; // Grows 15% per level
  const baseSize = (type === 'skyscraper' ? 70 : type === 'office' ? 60 : type === 'apartment' ? 55 : type === 'shop' ? 50 : 45) * sizeMultiplier;
  const height = (type === 'skyscraper' ? 90 : type === 'office' ? 70 : type === 'apartment' ? 60 : type === 'shop' ? 50 : 45) * sizeMultiplier;

  return (
    <div
      className="absolute cursor-pointer transition-transform hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.floor(position.y / 2)
      }}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Building container */}
      <div className="relative" style={{ width: `${baseSize + 20}px`, height: `${height + 40}px` }}>
        {/* Shadow */}
        <div
          className="absolute opacity-40"
          style={{
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${baseSize + 20}px`,
            height: '10px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
            filter: 'blur(4px)'
          }}
        />

        {/* Simple 3D Block Building */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          {/* Main building block */}
          <div
            className="relative border-4 border-black rounded-lg"
            style={{
              width: `${baseSize}px`,
              height: `${height}px`,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%)`,
              filter: 'url(#sketch-outline)',
              boxShadow: `
                inset -4px -4px 8px rgba(0,0,0,0.2),
                inset 4px 4px 8px rgba(255,255,255,0.3),
                6px 6px 0 rgba(0,0,0,0.3)
              `
            }}
          >
            {/* Shading on side */}
            <div
              className="absolute right-0 top-0 bottom-0 w-3 bg-black/20"
              style={{ filter: 'url(#sketch-outline)' }}
            />

            {/* Windows */}
            {type !== 'house' && (
              <div className="p-3 grid grid-cols-3 gap-2">
                {Array.from({ length: type === 'skyscraper' ? 18 : type === 'office' ? 12 : 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-cyan-200/80 border-2 border-black rounded-sm"
                    style={{
                      width: '8px',
                      height: '10px',
                      filter: 'url(#sketch-outline)',
                      boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.5)'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Door for houses */}
            {type === 'house' && (
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-900 border-3 border-black"
                style={{
                  width: '14px',
                  height: '20px',
                  filter: 'url(#sketch-outline)',
                  borderRadius: '4px 4px 0 0'
                }}
              />
            )}

            {/* Roof indicator */}
            <div
              className="absolute -top-2 left-0 right-0 h-2 border-2 border-black rounded-t-lg"
              style={{
                background: `linear-gradient(90deg, ${color}dd 0%, ${color}aa 100%)`,
                filter: 'url(#sketch-outline)'
              }}
            />
          </div>

          {/* Boss building special effects */}
          {isBoss && (
            <>
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 animate-pulse drop-shadow-lg"
                style={{ filter: 'url(#sketch-wobble)', fontSize: '32px' }}
              >
                <Crown size={32} />
              </div>
              {/* Lightning bolts */}
              <div className="absolute -left-3 top-1/2 text-yellow-300 text-2xl animate-pulse drop-shadow-lg">
                ⚡
              </div>
              <div className="absolute -right-3 top-1/3 text-yellow-300 text-2xl animate-pulse drop-shadow-lg" style={{ animationDelay: '0.5s' }}>
                ⚡
              </div>
            </>
          )}
        </div>

        {/* Status icons - BOTTOM LAYER */}
        {isLocked && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 rounded-full p-4 border-4 border-black shadow-xl" 
            style={{ filter: 'url(#sketch-outline)', zIndex: 10 }}
          >
            <Lock size={36} className="text-gray-700" strokeWidth={3} />
          </div>
        )}
        {isCompleted && (
          <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 border-4 border-black shadow-lg" style={{ filter: 'url(#sketch-outline)', zIndex: 10 }}>
            <CheckCircle2 size={28} className="text-green-500" strokeWidth={3} />
          </div>
        )}

        {/* Level indicator - MIDDLE LAYER */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-5 border-black bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 flex items-center justify-center font-black text-2xl shadow-2xl"
          style={{ filter: 'url(#sketch-outline)', zIndex: 50 }}
        >
          <span className="text-black drop-shadow-md">{level}</span>
        </div>

      </div>
    </div>
  );
};
