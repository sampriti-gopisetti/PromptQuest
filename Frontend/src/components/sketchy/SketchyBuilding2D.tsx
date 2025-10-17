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
    if (isBoss) return '#3b82f6'; // Blue for boss building
    return '#22c55e'; // Green for all other buildings
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
  
  // Progressive sizing based on level - MUCH SMALLER with subtle scaling
  const sizeMultiplier = 1 + (level - 1) * 0.01; // Only 1% increase per level
  const baseWidth = (type === 'skyscraper' ? 45 : type === 'office' ? 40 : type === 'apartment' ? 38 : type === 'shop' ? 35 : 32) * sizeMultiplier;
  const baseHeight = (type === 'skyscraper' ? 55 : type === 'office' ? 48 : type === 'apartment' ? 45 : type === 'shop' ? 40 : 38) * sizeMultiplier;

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
      <div className="relative" style={{ width: `${baseWidth + 20}px`, height: `${baseHeight + 40}px` }}>
        {/* Shadow */}
        <div
          className="absolute opacity-40"
          style={{
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${baseWidth + 20}px`,
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
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
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
              {/* Google G Symbol */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black"
                style={{ 
                  filter: 'url(#sketch-outline)',
                  background: 'linear-gradient(90deg, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC05 50%, #FBBC05 75%, #34A853 75%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                G
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

        {/* Level indicator */}
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-5 border-black flex items-center justify-center font-black text-2xl shadow-2xl ${
            isLocked 
              ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500' 
              : 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500'
          }`}
          style={{ filter: 'url(#sketch-outline)', zIndex: 50 }}
        >
          {isLocked ? (
            <Lock size={24} className="text-gray-700" strokeWidth={3} />
          ) : (
            <span className="text-black drop-shadow-md">{level}</span>
          )}
        </div>

      </div>
    </div>
  );
};
