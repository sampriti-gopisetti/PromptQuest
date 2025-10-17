import { cn } from '@/lib/utils';
import { Lock, Crown, CheckCircle2 } from 'lucide-react';

type NodeState = 'locked' | 'active' | 'completed';
type NodeType = 'normal' | 'boss';

interface LevelNodeProps {
  level: number;
  state: NodeState;
  type?: NodeType;
  position: { x: number; y: number };
  scale?: number;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
}

export const LevelNode = ({
  level,
  state,
  type = 'normal',
  position,
  scale = 1,
  onClick,
  onHover,
}: LevelNodeProps) => {
  const isBoss = type === 'boss';
  const size = isBoss ? 120 : 80;
  const actualSize = size * scale;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Outer glow ring */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-all duration-500',
          state === 'active' && 'animate-pulse-glow',
          state === 'completed' && 'opacity-50',
          state === 'locked' && 'opacity-20'
        )}
        style={{
          width: `${actualSize + 20}px`,
          height: `${actualSize + 20}px`,
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
          background: isBoss
            ? 'radial-gradient(circle, hsl(var(--accent) / 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Main node */}
      <div
        className={cn(
          'relative rounded-full border-2 backdrop-blur-sm transition-all duration-300',
          'flex items-center justify-center',
          'group-hover:scale-110 group-hover:brightness-125',
          state === 'locked' && 'border-muted bg-muted/20',
          state === 'active' &&
            (isBoss
              ? 'border-accent bg-gradient-boss shadow-boss'
              : 'border-primary bg-gradient-node shadow-glow'),
          state === 'completed' &&
            (isBoss
              ? 'border-gold bg-gradient-boss shadow-glow-strong'
              : 'border-primary/70 bg-gradient-node shadow-glow')
        )}
        style={{
          width: `${actualSize}px`,
          height: `${actualSize}px`,
        }}
      >
        {/* Animated background texture */}
        <div
          className={cn(
            'absolute inset-0 rounded-full opacity-30 animate-flow',
            state !== 'locked' && 'block',
            state === 'locked' && 'hidden'
          )}
          style={{
            background: isBoss
              ? 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.3), transparent)'
              : 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)',
          }}
        />

        {/* Orbiting particles for completed nodes */}
        {state === 'completed' && (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary animate-orbit"
                style={{
                  animationDelay: `${i * 0.7}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          {state === 'locked' && <Lock className="w-6 h-6 text-muted-foreground" />}
          {state === 'active' && isBoss && <Crown className="w-8 h-8 text-accent animate-pulse-glow" />}
          {state === 'completed' && (
            <CheckCircle2
              className={cn('w-6 h-6', isBoss ? 'text-gold' : 'text-primary')}
            />
          )}

          <span
            className={cn(
              'text-2xl font-bold transition-all',
              state === 'locked' && 'text-muted-foreground',
              state === 'active' && (isBoss ? 'text-accent glow-text' : 'text-primary glow-text'),
              state === 'completed' && (isBoss ? 'text-gold glow-text' : 'text-primary/80')
            )}
            style={{
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}
          >
            {level}
          </span>
        </div>

        {/* Inner glow */}
        {state !== 'locked' && (
          <div
            className="absolute inset-2 rounded-full pointer-events-none"
            style={{
              background: isBoss
                ? 'radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)'
                : 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Hover effect rings */}
      <div
        className="absolute inset-0 rounded-full border border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          width: `${actualSize + 30}px`,
          height: `${actualSize + 30}px`,
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      />
      <div
        className="absolute inset-0 rounded-full border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          width: `${actualSize + 50}px`,
          height: `${actualSize + 50}px`,
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
        }}
      />
    </div>
  );
};
