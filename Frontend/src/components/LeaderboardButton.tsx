import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeaderboardButtonProps {
  onClick: () => void;
  currentRank?: number;
}

export const LeaderboardButton = ({ onClick, currentRank = 1 }: LeaderboardButtonProps) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={onClick}
        size="lg"
        className="relative gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Trophy className="w-5 h-5" />
        Leaderboard
        <Badge variant="secondary" className="ml-1 bg-background/90 text-foreground">
          #{currentRank}
        </Badge>
      </Button>
    </div>
  );
};
