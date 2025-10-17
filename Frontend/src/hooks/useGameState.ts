import { create } from 'zustand';

interface GameState {
  currentLevel: number;
  completedLevels: number[];
  points: number;
  playerName: string;
  completeLevel: (levelId: number, earnedPoints: number) => void;
  unlockNextLevel: () => void;
  handleBossChallenge: (success: boolean) => void;
  resetGame: () => void;
}

export const useGameState = create<GameState>()((set, get) => ({
  currentLevel: 1,
  completedLevels: [],
  points: 0,
  playerName: 'You',

  completeLevel: (levelId: number, earnedPoints: number) => {
    const { completedLevels, points } = get();
    if (!completedLevels.includes(levelId)) {
      set({
        completedLevels: [...completedLevels, levelId],
        points: points + earnedPoints,
      });
    }
  },

  unlockNextLevel: () => {
    const { currentLevel } = get();
    if (currentLevel < 10) {
      set({ currentLevel: currentLevel + 1 });
    }
  },

  handleBossChallenge: (success: boolean) => {
    const { points } = get();
    if (success) {
      set({ points: points * 2 });
    } else {
      set({ points: Math.floor(points / 2) });
    }
  },

  resetGame: () => {
    set({
      currentLevel: 1,
      completedLevels: [],
      points: 0,
    });
  },
}));
