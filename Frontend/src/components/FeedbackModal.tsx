import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
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
      {/* Constrain height on mobile and add internal scroll for large feedback */}
      <DialogContent 
        className="responsive-modal-width sm:max-w-[700px] border-4 border-black max-h-[90vh] sm:max-h-none flex flex-col" 
        style={{ filter: 'url(#sketch-outline)', zIndex: 9999 }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">
            Level {level} - Result
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <button
            aria-label="Close"
            className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-sm shadow-md active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogClose>

        {/* Scrollable content region (flex-1) */}
        <div className="space-y-4 py-2 flex-1 overflow-y-auto pr-1">
          {/* Question Display */}
          <div className="space-y-2">
            <Label className="text-lg font-bold">
              Requirement
            </Label>
            <div
              className="p-3 rounded-lg border-3 border-black bg-blue-100 min-h-[48px] flex items-center text-sm sm:text-base text-black"
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
              className="p-3 rounded-lg border-3 border-black bg-gray-100 min-h-[48px] text-sm sm:text-base text-black whitespace-pre-wrap"
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
              className="p-3 rounded-lg border-3 border-black bg-purple-100 min-h-[48px] flex items-center justify-center text-lg sm:text-xl font-black text-black"
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
            <div className="max-h-[30vh] sm:max-h-none overflow-y-auto">
              <div
                className="p-4 rounded-lg border-3 border-black bg-white min-h-[96px] text-sm sm:text-base text-black whitespace-pre-wrap"
                style={{ filter: 'url(#sketch-outline)' }}
              >
                {feedback}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onNextLevel}
            className="w-full text-base sm:text-lg font-bold py-4 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 border-3 border-black animate-pulse hover:animate-none"
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