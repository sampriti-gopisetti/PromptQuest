interface SketchyFlower2DProps {
  position: { x: string; y: string };
  type: 'pink' | 'yellow' | 'red';
  rotation: number;
}

export const SketchyFlower2D = ({ position, type, rotation }: SketchyFlower2DProps) => {
  const colors = {
    pink: { petal: '#ec4899', center: '#fbbf24' },
    yellow: { petal: '#fbbf24', center: '#f97316' },
    red: { petal: '#ef4444', center: '#fbbf24' }
  };

  const color = colors[type];

  return (
    <div
      className="absolute"
      style={{
        left: position.x,
        bottom: position.y,
        transform: `rotate(${rotation}deg)`,
        zIndex: 5
      }}
    >
      <svg width="40" height="45" viewBox="0 0 40 45" style={{ filter: 'url(#sketch-outline)' }}>
        {/* Stem */}
        <path
          d="M 20 45 Q 18 35, 20 25"
          stroke="#22c55e"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Leaves */}
        <ellipse cx="16" cy="32" rx="4" ry="2.5" fill="#22c55e" stroke="#000" strokeWidth="1.5" transform="rotate(-30 16 32)" />
        <ellipse cx="24" cy="28" rx="4" ry="2.5" fill="#22c55e" stroke="#000" strokeWidth="1.5" transform="rotate(30 24 28)" />
        
        {/* Petals - 5 petals in circle */}
        <ellipse cx="20" cy="12" rx="5" ry="7" fill={color.petal} stroke="#000" strokeWidth="2" />
        <ellipse cx="11" cy="17" rx="5" ry="7" fill={color.petal} stroke="#000" strokeWidth="2" transform="rotate(-72 11 17)" />
        <ellipse cx="14" cy="26" rx="5" ry="7" fill={color.petal} stroke="#000" strokeWidth="2" transform="rotate(-144 14 26)" />
        <ellipse cx="26" cy="26" rx="5" ry="7" fill={color.petal} stroke="#000" strokeWidth="2" transform="rotate(144 26 26)" />
        <ellipse cx="29" cy="17" rx="5" ry="7" fill={color.petal} stroke="#000" strokeWidth="2" transform="rotate(72 29 17)" />
        
        {/* Center */}
        <circle cx="20" cy="19" r="4.5" fill={color.center} stroke="#000" strokeWidth="2" />
        
        {/* Center details */}
        <circle cx="18" cy="18" r="1" fill="#000" opacity="0.3" />
        <circle cx="22" cy="18" r="1" fill="#000" opacity="0.3" />
        <circle cx="20" cy="20.5" r="1" fill="#000" opacity="0.3" />
      </svg>
    </div>
  );
};
