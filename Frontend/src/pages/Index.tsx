import { useState } from 'react';
import { CityMap2D } from '@/components/CityMap2D';
import { PlayerStatus } from '@/components/PlayerStatus';
import { LeaderboardButton } from '@/components/LeaderboardButton';
import { Leaderboard } from '@/components/Leaderboard';
import { BossWarningDialog } from '@/components/BossWarningDialog';
import { CelebrationFireworks } from '@/components/CelebrationFireworks';
import { QuestionModal } from '@/components/QuestionModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useGameState } from '@/hooks/useGameState';
import { evaluatePrompt } from '@/lib/api';
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
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const LEVEL_ID_MAP: Record<number, string> = {
    1: 'roman_empire_facts',
    2: 'supply_and_demand',
    3: 'energy_saving_three',
    4: 'la_to_ny_best_travel',
    5: 'cookie_recipe_ingredients',
    6: 'car_arrival_time_210_miles',
    7: 'tsla_stock_price_now',
    8: 'short_history_of_coffee',
    9: 'email_week_off_boss',
    10: 'solar_vs_wind_benefits',
  };

  const handleAnswerSubmit = async (answer: string, question: string) => {
    if (currentQuestionLevel === null) return;
    setIsSubmitting(true);
    try {
      const level_id = LEVEL_ID_MAP[currentQuestionLevel] || 'roman_empire_facts';
      const result = await evaluatePrompt({ level_id, user_prompt: answer });
      // Store data for feedback modal
      setSubmittedAnswer(answer);
      setCurrentQuestion(question);
      setEarnedScore(result.score);
      setEvaluationFeedback(result.feedback);
      // Close question modal and open feedback modal
      setShowQuestionModal(false);
      setShowFeedbackModal(true);
      // toast({ title: 'Evaluation complete', description: result.feedback });
    } catch (err: any) {
      toast({ title: 'Evaluation failed', description: String(err), variant: 'destructive' });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleNextLevel = () => {
    if (currentQuestionLevel === null) return;

    // Close feedback modal FIRST so user sees the map
    setShowFeedbackModal(false);

    // Small delay to let modal close
    setTimeout(() => {
      if (earnedScore >= 60) {
        // Now update game state - this triggers character movement
        completeLevel(currentQuestionLevel, earnedScore);
        unlockNextLevel();
      
        // After character movement animation (~3 seconds), show celebration
        setTimeout(() => {
          setShowCelebration(true);
          toast({ title: '✅ Level Complete!', description: `+${earnedScore} points earned` });
          // Reset current question level
          setCurrentQuestionLevel(null);
        }, 3000);
      } else {
        // Stay on same level; show a gentle toast
        toast({ title: 'Try again', description: 'Score must be 60 or higher to unlock the next level.' });
        // Re-open the question modal for retry
        setTimeout(() => {
          setShowQuestionModal(true);
        }, 300);
      }
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
        isSubmitting={isSubmitting}
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
        feedback={evaluationFeedback}
        level={currentQuestionLevel || 1}
        onNextLevel={handleNextLevel}
      />
      
      {/* Celebration Effects */}
      {showCelebration && (
        <CelebrationFireworks onComplete={() => setShowCelebration(false)} />
      )}

      {/* Global submitting overlay */}
      <LoadingOverlay show={isSubmitting} message="AI Guru is working..." />
    </main>
  );
};

export default Index;
