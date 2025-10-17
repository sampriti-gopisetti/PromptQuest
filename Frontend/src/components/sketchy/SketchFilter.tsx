export const SketchFilter = () => {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {/* Rough outline filter */}
        <filter id="sketch-outline">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" seed="1" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* Wobble animation filter */}
        <filter id="sketch-wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" seed="2">
            <animate attributeName="baseFrequency" values="0.02;0.03;0.02" dur="3s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>

        {/* Shadow filter */}
        <filter id="sketch-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" />
          <feDisplacementMap in="offsetblur" in2="noise" scale="2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Cross-hatch patterns */}
        <pattern id="crosshatch-light" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M0,0 L4,4 M4,0 L0,4" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </pattern>

        <pattern id="crosshatch-dark" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M0,0 L4,4 M4,0 L0,4" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        </pattern>

        {/* Stipple pattern for grass */}
        <pattern id="stipple-grass" patternUnits="userSpaceOnUse" width="8" height="8">
          <circle cx="2" cy="2" r="0.5" fill="currentColor" opacity="0.4" />
          <circle cx="6" cy="4" r="0.5" fill="currentColor" opacity="0.4" />
          <circle cx="4" cy="6" r="0.5" fill="currentColor" opacity="0.4" />
        </pattern>
      </defs>
    </svg>
  );
};
