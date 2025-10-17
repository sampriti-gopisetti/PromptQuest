interface SketchyRoad2DProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  width?: number;
}

export const SketchyRoad2D = ({ start, end, width = 30 }: SketchyRoad2DProps) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div
      className="absolute"
      style={{
        left: `${start.x}px`,
        top: `${start.y}px`,
        width: `${length}px`,
        height: `${width}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left center',
        zIndex: 1
      }}
    >
      {/* Road surface */}
      <div
        className="absolute inset-0 bg-gray-600 border-2 border-gray-800"
        style={{
          filter: 'url(#sketch-outline)',
          borderRadius: '2px'
        }}
      >
        {/* Rough edges effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700" style={{ filter: 'url(#sketch-wobble)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-500" style={{ filter: 'url(#sketch-wobble)' }} />
      </div>

      {/* Center line - dashed yellow with irregular spacing */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 flex gap-2">
        {Array.from({ length: Math.floor(length / 25) }).map((_, i) => (
          <div
            key={i}
            className="bg-yellow-400 border border-yellow-600"
            style={{
              width: `${15 + Math.random() * 5}px`,
              height: '2px',
              filter: 'url(#sketch-outline)',
              transform: `rotate(${Math.random() * 4 - 2}deg) translateY(${Math.random() * 2 - 1}px)`
            }}
          />
        ))}
      </div>

      {/* Tire marks - faint sketchy lines */}
      <div
        className="absolute top-2 left-4 right-4 h-px bg-gray-800 opacity-20"
        style={{ filter: 'url(#sketch-wobble)' }}
      />
      <div
        className="absolute bottom-2 left-4 right-4 h-px bg-gray-800 opacity-20"
        style={{ filter: 'url(#sketch-wobble)' }}
      />

      {/* Random cracks */}
      {Array.from({ length: Math.floor(length / 80) }).map((_, i) => (
        <div
          key={`crack-${i}`}
          className="absolute bg-gray-800"
          style={{
            left: `${(i + 1) * 80 + Math.random() * 20}px`,
            top: `${Math.random() * width}px`,
            width: '1px',
            height: `${5 + Math.random() * 10}px`,
            transform: `rotate(${Math.random() * 60 - 30}deg)`,
            opacity: 0.3,
            filter: 'url(#sketch-outline)'
          }}
        />
      ))}
    </div>
  );
};
