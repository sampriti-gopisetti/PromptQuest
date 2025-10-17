import { Trophy, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface GameCompleteScreenProps {
  open: boolean;
  onClose: () => void;
  totalPoints: number;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export const GameCompleteScreen = ({
  open,
  onClose,
  totalPoints,
  onPlayAgain,
  onViewLeaderboard,
}: GameCompleteScreenProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (open) {
      // Generate floating particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 animate-fade-in">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s',
          }}
        >
          {particle.id % 3 === 0 ? (
            <Sparkles className="w-6 h-6 text-yellow-400" />
          ) : (
            <Star className="w-5 h-5 text-yellow-300" />
          )}
        </div>
      ))}

      {/* Main Content */}
      <div className="relative bg-gradient-to-br from-yellow-200 via-yellow-100 to-orange-200 p-6 rounded-2xl border-4 border-black shadow-2xl animate-scale-in max-w-lg mx-4">
        <svg width="0" height="0">
          <defs>
            <filter id="sketch-outline">
              <feTurbulence baseFrequency="0.05" numOctaves="2" result="turbulence" seed="2" />
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
            </filter>
          </defs>
        </svg>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          ✕
        </button>

        {/* Trophy Icon */}
        <div className="flex justify-center mb-4">
          <Trophy className="w-16 h-16 text-yellow-600 animate-bounce" />
        </div>

        {/* Congratulations Text */}
        <h1 className="text-3xl font-black text-center mb-3 text-gray-900">
          🏆 CONGRATULATIONS! 🏆
        </h1>
        
        <p className="text-lg text-center mb-6 text-gray-800 font-bold">
          You've conquered all 10 levels!
        </p>

        {/* Stats Display */}
        <div className="space-y-3 mb-6">
          <div 
            className="bg-white p-4 rounded-xl border-4 border-black shadow-lg text-center"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            <div className="text-2xl font-black text-gray-900 mb-1">
              💰 {totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-bold">Total Points</div>
          </div>

          <div 
            className="bg-white p-4 rounded-xl border-4 border-black shadow-lg text-center"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            <div className="text-2xl font-black text-gray-900 mb-1">
              ⭐ 10/10
            </div>
            <div className="text-sm text-gray-600 font-bold">Levels Completed</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onPlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white font-black text-sm px-5 py-3 border-4 border-black shadow-lg"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            🎮 Play Again
          </Button>
          
          <Button
            onClick={onViewLeaderboard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-black text-sm px-5 py-3 border-4 border-black shadow-lg"
            style={{ filter: 'url(#sketch-outline)' }}
          >
            🏆 Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};
