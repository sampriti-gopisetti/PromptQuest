import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PlayerStatusProps {
  points: number;
  level: number;
  className?: string;
}

export const PlayerStatus = ({ points, level, className }: PlayerStatusProps) => {
  return (
    <div
      className={cn(
        'fixed top-8 left-8 z-50',
        'p-6 rounded-2xl border-2 border-primary/50',
        'bg-card/80 backdrop-blur-xl shadow-glow',
        'transition-all duration-500',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Operator Glyph */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-node animate-pulse-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
          </div>
          {/* Orbiting indicator */}
          <div className="absolute inset-0">
            <div className="w-2 h-2 rounded-full bg-primary absolute top-0 left-1/2 transform -translate-x-1/2 animate-orbit" />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Level</span>
            <span className="text-2xl font-bold text-primary glow-text font-mono">{level}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Points</span>
            <span className="text-xl font-bold text-foreground font-mono">{points}</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent animate-flow rounded-full"
            style={{ width: `${Math.min((points % 1000) / 10, 100)}%` }}
          />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg" />
    </div>
  );
};
