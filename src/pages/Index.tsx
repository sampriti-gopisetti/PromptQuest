import { useState } from 'react';
import { CityMap2D } from '@/components/CityMap2D';
import { PlayerStatus } from '@/components/PlayerStatus';
import { LeaderboardButton } from '@/components/LeaderboardButton';
import { Leaderboard } from '@/components/Leaderboard';
import { BossWarningDialog } from '@/components/BossWarningDialog';
import { CelebrationFireworks } from '@/components/CelebrationFireworks';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBossWarning, setShowBossWarning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { points, currentLevel, completeLevel, unlockNextLevel } = useGameState();

  const handleBossClick = () => {
    setShowBossWarning(true);
  };

  const handleBossAccept = () => {
    setShowBossWarning(false);
    toast({
      title: '⚔️ Boss Challenge Started!',
      description: 'Navigate to the challenge screen...',
    });
    // In a real app, navigate to the boss challenge screen
  };

  const handleLevelClick = (level: number) => {
    toast({
      title: `Level ${level} Selected`,
      description: 'Starting challenge...',
    });
    // In a real app, navigate to the level challenge screen
    // For demo: auto-complete after 2 seconds
    setTimeout(() => {
      completeLevel(level, 500);
      unlockNextLevel();
      
      // Show celebration fireworks
      setShowCelebration(true);
      
      setTimeout(() => {
        toast({
          title: '✅ Level Complete!',
          description: `+500 points earned`,
        });
      }, 500);
    }, 2000);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sky-200">
      {/* 2D City Map */}
      <CityMap2D onBossClick={handleBossClick} onLevelClick={handleLevelClick} />

      {/* UI Overlays */}
      <PlayerStatus points={points} level={currentLevel} />
      <LeaderboardButton onClick={() => setShowLeaderboard(true)} />

      {/* Modals */}
      <Leaderboard open={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <BossWarningDialog
        open={showBossWarning}
        onAccept={handleBossAccept}
        onCancel={() => setShowBossWarning(false)}
      />
      
      {/* Celebration Effects */}
      {showCelebration && (
        <CelebrationFireworks onComplete={() => setShowCelebration(false)} />
      )}
    </main>
  );
};

export default Index;
