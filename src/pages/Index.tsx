import { useState } from 'react';
import { CityMap2D } from '@/components/CityMap2D';
import { PlayerStatus } from '@/components/PlayerStatus';
import { LeaderboardButton } from '@/components/LeaderboardButton';
import { Leaderboard } from '@/components/Leaderboard';
import { BossWarningDialog } from '@/components/BossWarningDialog';
import { CelebrationFireworks } from '@/components/CelebrationFireworks';
import { QuestionModal } from '@/components/QuestionModal';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBossWarning, setShowBossWarning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestionLevel, setCurrentQuestionLevel] = useState<number | null>(null);
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
    setCurrentQuestionLevel(level);
    setShowQuestionModal(true);
  };

  const handleAnswerSubmit = (answer: string) => {
    if (currentQuestionLevel === null) return;

    // Mock scoring logic - In real app, send to API for validation
    const score = Math.floor(Math.random() * 400) + 100; // Random score between 100-500

    // Close modal
    setShowQuestionModal(false);

    // Update game state
    completeLevel(currentQuestionLevel, score);
    unlockNextLevel();

    // Show celebration
    setShowCelebration(true);

    // Show success toast
    setTimeout(() => {
      toast({
        title: '✅ Level Complete!',
        description: `+${score} points earned`,
      });
    }, 500);

    // Reset current question level
    setCurrentQuestionLevel(null);
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
      <QuestionModal
        open={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setCurrentQuestionLevel(null);
        }}
        level={currentQuestionLevel || 1}
        onSubmit={handleAnswerSubmit}
      />
      
      {/* Celebration Effects */}
      {showCelebration && (
        <CelebrationFireworks onComplete={() => setShowCelebration(false)} />
      )}
    </main>
  );
};

export default Index;
