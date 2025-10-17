import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  question: string;
  userAnswer: string;
  score: number;
  level: number;
  onNextLevel: () => void;
}

export const FeedbackModal = ({
  open,
  onClose,
  question,
  userAnswer,
  score,
  level,
  onNextLevel
}: FeedbackModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px] border-4 border-black" 
        style={{ filter: 'url(#sketch-outline)', zIndex: 9999 }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">
            Level {level} - Result
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Question Display */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Question:
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-blue-100 min-h-[60px] flex items-center text-base text-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              {question}
            </div>
          </div>

          {/* User Answer Display */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Your Answer:
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-gray-100 min-h-[60px] flex items-center text-base text-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              {userAnswer}
            </div>
          </div>

          {/* Feedback Content */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Feedback:
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-green-100 min-h-[50px] flex items-center text-base text-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              {score >= 400 
                ? "🌟 Excellent work! Your answer shows deep understanding of the concept."
                : score >= 300
                ? "👍 Great job! You've demonstrated good knowledge on this topic."
                : score >= 200
                ? "✨ Well done! You're making solid progress through the levels."
                : "💪 Nice effort! Keep learning and you'll master this in no time."}
            </div>
          </div>

          {/* Score Display - Separate Box */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Score Earned:
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-purple-100 min-h-[60px] flex items-center justify-center text-2xl font-black text-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              🎉 +{score} points
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onNextLevel}
            className="w-full text-lg font-bold py-4 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 border-3 border-black animate-pulse hover:animate-none"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            Next Level
            <ArrowRight className="ml-2" size={24} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};