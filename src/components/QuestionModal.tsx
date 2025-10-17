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
import { Lightbulb } from 'lucide-react';

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  level: number;
  onSubmit: (answer: string, question: string) => void;
}

export const QuestionModal = ({ open, onClose, level, onSubmit }: QuestionModalProps) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Mock question data - In real app, fetch from API based on level
  const questions = [
    { question: 'What is 2 + 2?', hint: 'Think about basic addition.' },
    { question: 'What is the capital of France?', hint: 'It\'s known as the City of Light.' },
    { question: 'What color is the sky?', hint: 'Look up on a clear day.' },
    { question: 'How many sides does a triangle have?', hint: 'Tri means three.' },
    { question: 'What is 5 x 5?', hint: 'Five times five equals?' },
    { question: 'What is H2O?', hint: 'Essential for life.' },
    { question: 'Who painted the Mona Lisa?', hint: 'Famous Renaissance artist.' },
    { question: 'What is the largest planet?', hint: 'Named after a Roman god.' },
    { question: 'What is the speed of light?', hint: 'Very, very fast!' },
    { question: 'Who is the boss of this game?', hint: 'You\'re about to meet them!' },
  ];

  const currentQuestion = questions[level - 1] || questions[0];

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer, currentQuestion.question);
      setAnswer('');
      setShowHint(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-4 border-black" style={{ filter: 'url(#sketch-outline)', zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">
            Level {level} Challenge
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question Area */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-lg font-bold">
              Question:
            </Label>
            <div
              id="question"
              className="p-4 rounded-lg border-3 border-black bg-blue-50 min-h-[100px] flex items-center text-lg font-semibold"
              style={{ filter: 'url(#sketch-outline)' }}
            >
              {currentQuestion.question}
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-lg font-bold">
              Your Answer:
            </Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
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
                className="p-4 rounded-lg border-3 border-black bg-yellow-50 text-base italic"
                style={{ filter: 'url(#sketch-outline)' }}
              >
                💡 {currentQuestion.hint}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full text-lg font-bold py-6 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 border-3 border-black animate-pulse hover:animate-none"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            Submit Answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
