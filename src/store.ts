import { create } from 'zustand';

interface GameState {
  lives: any;
  score: number;
  gameOver: boolean;
  handPosition: { x: number; y: number } | null;
  incrementScore: () => void;
  setGameOver: (value: boolean) => void;
  resetGame: () => void;
  setHandPosition: (position: { x: number; y: number } | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  gameOver: false,
  handPosition: null,
  lives: 3,
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  setGameOver: (value) => set({ gameOver: value }),
  resetGame: () => set({ score: 0, gameOver: false, lives: 3 }),
  setHandPosition: (position) => set({ handPosition: position }),
}));