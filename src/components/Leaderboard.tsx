import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  points: number;
  level: number;
  isCurrentPlayer?: boolean;
}

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
}

// Mock data - replace with actual data later
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, playerName: 'PromptMaster', points: 15420, level: 10 },
  { rank: 2, playerName: 'AIWhisperer', points: 12850, level: 10 },
  { rank: 3, playerName: 'CodeNinja', points: 11200, level: 9 },
  { rank: 4, playerName: 'DataWizard', points: 9800, level: 8 },
  { rank: 5, playerName: 'QueryQueen', points: 8500, level: 8 },
  { rank: 6, playerName: 'You', points: 2850, level: 7, isCurrentPlayer: true },
  { rank: 7, playerName: 'TokenTamer', points: 7200, level: 7 },
  { rank: 8, playerName: 'ContextKing', points: 6500, level: 6 },
  { rank: 9, playerName: 'LLMExplorer', points: 5800, level: 6 },
  { rank: 10, playerName: 'PromptPro', points: 4900, level: 5 },
];

export const Leaderboard = ({ open, onClose }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/50';
      case 2:
        return 'from-gray-400/20 to-gray-500/10 border-gray-400/50';
      case 3:
        return 'from-amber-600/20 to-amber-700/10 border-amber-600/50';
      default:
        return 'from-background to-secondary/20 border-border';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </SheetTitle>
          <SheetDescription>Top players in Prompt Quest</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {mockLeaderboard.map((entry, index) => (
            <div
              key={entry.rank}
              className={cn(
                'p-4 rounded-lg border-2 bg-gradient-to-r transition-all duration-300',
                getRankColor(entry.rank),
                entry.isCurrentPlayer && 'ring-2 ring-primary shadow-lg scale-105',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getRankIcon(entry.rank)}</div>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-bold truncate',
                    entry.isCurrentPlayer && 'text-primary'
                  )}>
                    {entry.playerName}
                    {entry.isCurrentPlayer && ' (You)'}
                  </p>
                  <p className="text-sm text-muted-foreground">Level {entry.level}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">{entry.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-center text-muted-foreground">
            Complete challenges to climb the ranks! 🚀
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
