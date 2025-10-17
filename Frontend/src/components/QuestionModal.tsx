import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lightbulb, Loader2 } from 'lucide-react';

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  level: number;
  onSubmit: (answer: string, question: string) => void;
  isSubmitting?: boolean;
}

export const QuestionModal = ({ open, onClose, level, onSubmit, isSubmitting = false }: QuestionModalProps) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Hardcoded requirements matching backend levels.py
  const QUESTIONS_BY_LEVEL: Record<number, string> = {
    1: 'Give me five facts about the Roman Empire.',
    2: 'Explain the concept of supply and demand.',
    3: 'What are three ways to save energy at home?',
    4: 'What is the best way to travel from Los Angeles to New York?',
    5: 'List the ingredients for a basic chocolate chip cookie recipe.',
    6: 'If a car travels 60 miles per hour and leaves at 10:00 AM, what time will it arrive at a city 210 miles away?',
    7: 'What is the stock price of Tesla (TSLA) right now?',
    8: 'Write a short history of coffee.',
    9: 'Draft a quick email to my boss asking for a week off.',
    10: 'What are the benefits of solar power versus wind power?',
  };

  const questionText = QUESTIONS_BY_LEVEL[level] || QUESTIONS_BY_LEVEL[1];

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer, questionText);
      setAnswer('');
      setShowHint(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] border-4 border-black" style={{ filter: 'url(#sketch-outline)', zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">
            Level {level} Challenge
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question Area */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-lg font-bold">
              Requirement:
            </Label>
            <div
              id="question"
              className="p-4 rounded-lg border-3 border-black bg-blue-50 min-h-[100px] flex items-center text-lg font-semibold text-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
                {questionText}
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-lg font-bold">
              Give your best prompt for LLM to render
            </Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your prompt here (what you'd send to an AI to solve the challenge)..."
              className="min-h-[120px] border-3 border-black text-base"
              style={{ filter: 'url(#sketch-outline)' }}
            />
          </div>

          {/* Hint Section */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="w-full border-3 border-black"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              <Lightbulb className="mr-2" size={18} />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            {showHint && (
              <div
                className="p-4 rounded-lg border-3 border-black bg-yellow-50 text-base italic text-black"
                style={{ filter: 'url(#sketch-outline)' }}
              >
                  💡 Tip: Strong prompts define format, persona, and constraints. For example, ask for a Markdown table, a friendly tutor persona, and 'exactly 5 items'.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
            className="w-full text-lg font-bold py-6 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 border-3 border-black animate-pulse hover:animate-none"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>) : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
