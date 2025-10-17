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
  feedback: string;
  level: number;
  onNextLevel: () => void;
}

export const FeedbackModal = ({
  open,
  onClose,
  question,
  userAnswer,
  score,
  feedback,
  level,
  onNextLevel
}: FeedbackModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[700px] border-4 border-black" 
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
              Requirement
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-blue-100 min-h-[48px] flex items-center text-base text-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              {question}
            </div>
          </div>

          {/* Your Prompt Display */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Prompt Given
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-gray-100 min-h-[48px] text-base text-black whitespace-pre-wrap"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              {userAnswer}
            </div>
          </div>

          {/* Score Earned */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Score
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-purple-100 min-h-[48px] flex items-center justify-center text-xl font-black text-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              🎉 +{score} points
            </div>
          </div>

          {/* Feedback Text Display */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Feedback:
            </Label>
            <div
              className="p-4 rounded-lg border-3 border-black bg-white min-h-[96px] text-base text-black whitespace-pre-wrap"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              {feedback}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onNextLevel}
            className="w-full text-lg font-bold py-4 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 border-3 border-black animate-pulse hover:animate-none"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            {score >= 60 ? 'Next Level' : 'Try Again'}
            <ArrowRight className="ml-2" size={24} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};