import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerStatusProps {
  points: number;
  level: number;
  className?: string;
}

export const PlayerStatus = ({ points, level, className }: PlayerStatusProps) => {
  // Calculate progress to next level (example: 1000 points per level)
  const pointsPerLevel = 1000;
  const progress = (points % pointsPerLevel) / pointsPerLevel;

  return (
    <div
      className={cn(
        'absolute top-3 left-3 z-[1000] w-[88vw] xs:w-64 max-w-sm animate-fade-in',
        'bg-gradient-to-br from-card via-card to-secondary/20',
        'backdrop-blur-md border-2 border-primary rounded-xl p-3 shadow-2xl',
        'sm:top-5 sm:left-5',
        className
      )}
    >
      {/* Content */}
      <div className="relative space-y-2">
        {/* Header - Compact */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-2 ring-primary/30">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PROMPT QUEST
            </h2>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">Your Adventure</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-primary/10 rounded-lg p-2 border border-primary/20">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">Level</p>
            <p className="text-xl sm:text-2xl font-bold text-primary">{level}</p>
          </div>
          <div className="bg-secondary/10 rounded-lg p-2 border border-secondary/20">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5">Points</p>
            <p className="text-lg sm:text-xl font-bold text-secondary">{points.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] sm:text-[10px] text-muted-foreground">
            <span>Next Level</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
