import { useEffect, useState } from 'react';

interface SketchyCharacter2DProps {
  position: { x: number; y: number };
  state: 'idle' | 'running' | 'entering' | 'celebrating';
  direction?: 'left' | 'right';
}

export const SketchyCharacter2D = ({
  position,
  state,
  direction = 'right'
}: SketchyCharacter2DProps) => {
  const [wobble, setWobble] = useState(0);

  useEffect(() => {
    if (state === 'idle') {
      const interval = setInterval(() => {
        setWobble(Math.sin(Date.now() / 500) * 2);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  return (
    <div
      className="absolute transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) ${direction === 'left' ? 'scaleX(-1)' : ''}`,
        zIndex: 9999
      }}
    >
      {/* Character body - simple blob with sketchy outline */}
      <div className="relative">
        {/* Dust clouds when running */}
        {state === 'running' && (
          <>
            <div
              className="absolute -left-8 top-4 text-gray-400 text-xl animate-ping"
              style={{ filter: 'url(#sketch-outline)', animationDuration: '0.5s' }}
            >
              💨
            </div>
            <div
              className="absolute -left-12 top-6 text-gray-400 text-sm animate-ping"
              style={{ filter: 'url(#sketch-outline)', animationDuration: '0.7s', animationDelay: '0.1s' }}
            >
              💨
            </div>
          </>
        )}

        {/* Main character body */}
        <div
          className="relative bg-blue-500 border-3 border-black rounded-full"
          style={{
            width: '32px',
            height: '40px',
            filter: 'url(#sketch-outline)',
            transform: `rotate(${wobble}deg) scale(${state === 'entering' ? 0.5 : state === 'celebrating' ? 1.2 : 1})`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* Eyes */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
            <div
              className="w-2 h-2 bg-black rounded-full"
              style={{ 
                filter: 'url(#sketch-outline)',
                transform: state === 'celebrating' ? 'scaleY(0.3)' : 'scaleY(1)'
              }}
            />
            <div
              className="w-2 h-2 bg-black rounded-full"
              style={{ 
                filter: 'url(#sketch-outline)',
                transform: state === 'celebrating' ? 'scaleY(0.3)' : 'scaleY(1)'
              }}
            />
          </div>

          {/* Mouth */}
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 w-3 h-1 bg-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'celebrating' ? 'scaleX(1.5)' : 'scaleX(1)'
            }}
          />

          {/* Arms */}
          <div
            className="absolute top-3 -left-2 w-6 h-1 bg-blue-500 border border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(-20deg)' : state === 'celebrating' ? 'rotate(-45deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }}
          />
          <div
            className="absolute top-3 -right-2 w-6 h-1 bg-blue-500 border border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(20deg)' : state === 'celebrating' ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }}
          />
        </div>

        {/* Legs - wobble when running */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div
            className="w-1 h-4 bg-blue-700 border border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(-10deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s'
            }}
          />
          <div
            className="w-1 h-4 bg-blue-700 border border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(10deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s'
            }}
          />
        </div>

        {/* Celebration sparkles */}
        {state === 'celebrating' && (
          <>
            <div className="absolute -top-4 -left-4 text-yellow-400 animate-ping text-xl">✨</div>
            <div className="absolute -top-4 -right-4 text-yellow-400 animate-ping text-xl" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-yellow-400 animate-ping text-xl" style={{ animationDelay: '0.4s' }}>⭐</div>
          </>
        )}

        {/* Shadow */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full"
          style={{ filter: 'blur(2px)' }}
        />
      </div>
    </div>
  );
};
