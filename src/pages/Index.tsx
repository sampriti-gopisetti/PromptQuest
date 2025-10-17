import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SpiralStaircase3D } from '@/components/SpiralStaircase3D';
import { PlayerStatus } from '@/components/PlayerStatus';
import { LeaderboardButton } from '@/components/LeaderboardButton';
import { Leaderboard } from '@/components/Leaderboard';
import { BossWarningDialog } from '@/components/BossWarningDialog';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBossWarning, setShowBossWarning] = useState(false);
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
      toast({
        title: '✅ Level Complete!',
        description: `+500 points earned`,
      });
    }, 2000);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-background to-slate-900">
      {/* 3D Canvas */}
      <Canvas shadows>
        <SpiralStaircase3D onBossClick={handleBossClick} onLevelClick={handleLevelClick} />
      </Canvas>

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
    </main>
  );
};

export default Index;
