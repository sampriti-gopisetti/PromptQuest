interface SketchyTree2DProps {
  position: { x: number; y: number };
  scale?: number;
  type?: 'oak' | 'pine' | 'palm';
}

export const SketchyTree2D = ({ 
  position, 
  scale = 1,
  type = 'oak'
}: SketchyTree2DProps) => {
  const getTreeStyle = () => {
    switch (type) {
      case 'pine':
        return {
          canopyColor: '#2D5016',
          shape: 'triangle',
          size: 20 * scale
        };
      case 'palm':
        return {
          canopyColor: '#3A6B1F',
          shape: 'star',
          size: 18 * scale
        };
      default: // oak
        return {
          canopyColor: '#48BB78',
          shape: 'circle',
          size: 24 * scale
        };
    }
  };

  const style = getTreeStyle();

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.floor(position.y),
        filter: 'url(#sketch-outline)'
      }}
    >
      {/* Shadow */}
      <div
        className="absolute opacity-20"
        style={{
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${style.size}px`,
          height: '4px',
          background: '#000',
          borderRadius: '50%',
          filter: 'blur(2px)'
        }}
      />

      {/* Trunk - isometric cylinder */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-amber-800 border-2 border-black"
        style={{
          width: `${4 * scale}px`,
          height: `${15 * scale}px`,
          bottom: '0',
          borderRadius: '2px',
          filter: 'url(#sketch-outline)',
          transform: 'translateX(-50%) rotateX(60deg)'
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-900" />
      </div>

      {/* Canopy */}
      {style.shape === 'circle' && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: `${10 * scale}px` }}>
          {/* Multiple layers for sketchy effect */}
          {[0, 1, 2].map((layer) => (
            <div
              key={layer}
              className="border-2 border-black"
              style={{
                width: `${style.size - layer * 2}px`,
                height: `${style.size - layer * 2}px`,
                background: style.canopyColor,
                borderRadius: '50%',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${layer * 30}deg)`,
                filter: 'url(#sketch-outline)',
                opacity: 1 - layer * 0.1
              }}
            />
          ))}
          {/* Scribbled details */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ filter: 'url(#sketch-wobble)' }}>
            <div className="text-green-900 text-xs">🍃</div>
          </div>
        </div>
      )}

      {style.shape === 'triangle' && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: `${8 * scale}px` }}>
          {/* Pine tree - stacked triangles */}
          {[0, 1, 2].map((tier) => (
            <div
              key={tier}
              className="border-2 border-black"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${(style.size / 2 - tier * 3) * scale}px solid transparent`,
                borderRight: `${(style.size / 2 - tier * 3) * scale}px solid transparent`,
                borderBottom: `${(style.size - tier * 4) * scale}px solid ${style.canopyColor}`,
                position: 'absolute',
                left: '50%',
                transform: `translateX(-50%) translateY(${tier * 8 * scale}px)`,
                filter: 'url(#sketch-outline)'
              }}
            />
          ))}
        </div>
      )}

      {style.shape === 'star' && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: `${10 * scale}px` }}>
          {/* Palm fronds */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <div
              key={angle}
              className="absolute bg-green-700 border border-black"
              style={{
                width: `${style.size * 0.6}px`,
                height: `${4 * scale}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                transformOrigin: 'left center',
                borderRadius: '0 50% 50% 0',
                filter: 'url(#sketch-outline)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
