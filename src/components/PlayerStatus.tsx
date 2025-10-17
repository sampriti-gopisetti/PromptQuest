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
        'fixed top-4 left-4 z-50 w-72 animate-fade-in',
        'bg-gradient-to-br from-card via-card to-secondary/20',
        'backdrop-blur-md border-2 border-primary rounded-xl p-4 shadow-2xl',
        className
      )}
    >
      {/* Content */}
      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-2 ring-primary/30">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PROMPT QUEST
            </h2>
            <p className="text-xs text-muted-foreground">Your Adventure</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Level</p>
            <p className="text-3xl font-bold text-primary">{level}</p>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3 border border-secondary/20">
            <p className="text-xs text-muted-foreground mb-1">Points</p>
            <p className="text-2xl font-bold text-secondary">{points.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Next Level</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
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
