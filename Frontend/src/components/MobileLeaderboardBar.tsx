import { useGameState } from '@/hooks/useGameState';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileLeaderboardBarProps {
  onOpenFull: () => void;
}

export const MobileLeaderboardBar = ({ onOpenFull }: MobileLeaderboardBarProps) => {
  const { points, currentLevel, playerName } = useGameState();
  return (
    <div
      className={cn(
        'w-full bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 backdrop-blur-md',
        'border-t border-border px-3 py-2 flex items-center justify-between gap-2',
        'text-xs'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
        <div className="truncate font-semibold">{playerName}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-[10px] flex flex-col items-center">
          <span className="uppercase tracking-wide text-muted-foreground">Lvl</span>
          <span className="font-bold text-primary">{currentLevel}</span>
        </div>
        <div className="text-[10px] flex flex-col items-center">
          <span className="uppercase tracking-wide text-muted-foreground">Pts</span>
          <span className="font-bold text-secondary">{points}</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-[10px]"
        onClick={onOpenFull}
      >
        Full
      </Button>
    </div>
  );
};