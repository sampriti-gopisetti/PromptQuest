import { useState } from 'react';
import { CityMap2D } from '@/components/CityMap2D';
import { PlayerStatus } from '@/components/PlayerStatus';
import { LeaderboardButton } from '@/components/LeaderboardButton';
import { Leaderboard } from '@/components/Leaderboard';
import { BossWarningDialog } from '@/components/BossWarningDialog';
import { CelebrationFireworks } from '@/components/CelebrationFireworks';
import { QuestionModal } from '@/components/QuestionModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBossWarning, setShowBossWarning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentQuestionLevel, setCurrentQuestionLevel] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [earnedScore, setEarnedScore] = useState(0);
  const { points, currentLevel, completedLevels, completeLevel, unlockNextLevel } = useGameState();

  const handleBossClick = () => {
    setShowBossWarning(true);
  };

  const handleBossAccept = () => {
    setShowBossWarning(false);
    // Open the question modal for level 10
    setCurrentQuestionLevel(10);
    setShowQuestionModal(true);
  };

  const handleLevelClick = (level: number) => {
    setCurrentQuestionLevel(level);
    setShowQuestionModal(true);
  };

  const handleCharacterArrival = (level: number) => {
    // After character arrives, auto-open the appropriate modal
    if (level === 10 && completedLevels.includes(9)) {
      // Boss level - show warning
      setShowBossWarning(true);
    } else if (level <= 10) {
      // Regular level - show question modal
      setCurrentQuestionLevel(level);
      setShowQuestionModal(true);
    }
  };

  const handleAnswerSubmit = (answer: string, question: string) => {
    if (currentQuestionLevel === null) return;

    // Mock scoring logic - In real app, send to API for validation
    const score = Math.floor(Math.random() * 400) + 100; // Random score between 100-500

    // Store data for feedback modal
    setSubmittedAnswer(answer);
    setCurrentQuestion(question);
    setEarnedScore(score);

    // Close question modal and open feedback modal
    setShowQuestionModal(false);
    setShowFeedbackModal(true);
  };

  const handleNextLevel = () => {
    if (currentQuestionLevel === null) return;

    // Close feedback modal FIRST so user sees the map
    setShowFeedbackModal(false);

    // Small delay to let modal close
    setTimeout(() => {
      // Now update game state - this triggers character movement
      completeLevel(currentQuestionLevel, earnedScore);
      unlockNextLevel();
      
    // After character movement animation (~3 seconds), show celebration
    setTimeout(() => {
      setShowCelebration(true);
      
      toast({
        title: '✅ Level Complete!',
        description: `+${earnedScore} points earned`,
      });
      
      // Reset current question level
      setCurrentQuestionLevel(null);
    }, 3000);
    }, 300);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sky-200">
      {/* 2D City Map */}
      <CityMap2D 
        onBossClick={handleBossClick} 
        onLevelClick={handleLevelClick}
        onCharacterArrival={handleCharacterArrival}
      />

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
      <FeedbackModal
        open={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setCurrentQuestionLevel(null);
        }}
        question={currentQuestion}
        userAnswer={submittedAnswer}
        score={earnedScore}
        level={currentQuestionLevel || 1}
        onNextLevel={handleNextLevel}
      />
      
      {/* Celebration Effects */}
      {showCelebration && (
        <CelebrationFireworks onComplete={() => setShowCelebration(false)} />
      )}
    </main>
  );
};

export default Index;
