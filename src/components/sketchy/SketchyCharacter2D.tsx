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
      className="absolute transition-all duration-2000"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) ${direction === 'left' ? 'scaleX(-1)' : ''}`,
        zIndex: Math.floor(position.y / 2) + 100
      }}
    >
      {/* Character body - larger and more visible */}
      <div className="relative">
        {/* Dust clouds when running */}
        {state === 'running' && (
          <>
            <div
              className="absolute -left-10 top-6 text-gray-400 text-3xl animate-ping"
              style={{ filter: 'url(#sketch-outline)', animationDuration: '0.5s' }}
            >
              💨
            </div>
            <div
              className="absolute -left-16 top-8 text-gray-400 text-2xl animate-ping"
              style={{ filter: 'url(#sketch-outline)', animationDuration: '0.7s', animationDelay: '0.1s' }}
            >
              💨
            </div>
          </>
        )}

        {/* Main character body - BIGGER */}
        <div
          className="relative border-4 border-black rounded-full shadow-2xl"
          style={{
            width: '56px',
            height: '64px',
            background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #2563EB 100%)',
            filter: 'url(#sketch-outline)',
            transform: `rotate(${wobble}deg) scale(${state === 'entering' ? 0.5 : state === 'celebrating' ? 1.4 : 1})`,
            transition: 'transform 0.3s ease-out',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset -3px -3px 6px rgba(0,0,0,0.2), inset 3px 3px 6px rgba(255,255,255,0.3)'
          }}
        >
          {/* Eyes - BIGGER */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2">
            <div
              className="w-3 h-3 bg-white rounded-full border-2 border-black"
              style={{ 
                filter: 'url(#sketch-outline)',
                transform: state === 'celebrating' ? 'scaleY(0.3)' : 'scaleY(1)'
              }}
            >
              <div className="w-1.5 h-1.5 bg-black rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
            </div>
            <div
              className="w-3 h-3 bg-white rounded-full border-2 border-black"
              style={{ 
                filter: 'url(#sketch-outline)',
                transform: state === 'celebrating' ? 'scaleY(0.3)' : 'scaleY(1)'
              }}
            >
              <div className="w-1.5 h-1.5 bg-black rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Mouth - BIGGER */}
          <div
            className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-2 border-b-3 border-black rounded-b-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'celebrating' ? 'scaleX(1.8)' : 'scaleX(1)',
              borderColor: state === 'celebrating' ? '#000' : '#000'
            }}
          />

          {/* Arms - BIGGER */}
          <div
            className="absolute top-5 -left-3 w-8 h-2 bg-blue-400 border-2 border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(-20deg)' : state === 'celebrating' ? 'rotate(-50deg)' : 'rotate(-10deg)',
              transition: 'transform 0.3s'
            }}
          />
          <div
            className="absolute top-5 -right-3 w-8 h-2 bg-blue-400 border-2 border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(20deg)' : state === 'celebrating' ? 'rotate(50deg)' : 'rotate(10deg)',
              transition: 'transform 0.3s'
            }}
          />
        </div>

        {/* Legs - BIGGER */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          <div
            className="w-2 h-6 bg-blue-600 border-2 border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(-15deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
              boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.3)'
            }}
          />
          <div
            className="w-2 h-6 bg-blue-600 border-2 border-black rounded-full"
            style={{
              filter: 'url(#sketch-outline)',
              transform: state === 'running' ? 'rotate(15deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
              boxShadow: 'inset -1px -1px 2px rgba(0,0,0,0.3)'
            }}
          />
        </div>

        {/* Celebration sparkles - BIGGER */}
        {state === 'celebrating' && (
          <>
            <div className="absolute -top-6 -left-6 text-yellow-400 animate-ping text-3xl drop-shadow-lg">✨</div>
            <div className="absolute -top-6 -right-6 text-yellow-400 animate-ping text-3xl drop-shadow-lg" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-yellow-400 animate-ping text-3xl drop-shadow-lg" style={{ animationDelay: '0.4s' }}>⭐</div>
          </>
        )}

        {/* Shadow - BIGGER */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/40 rounded-full"
          style={{ filter: 'blur(3px)' }}
        />
      </div>
    </div>
  );
};
