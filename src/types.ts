export interface Fruit {
  id: string;
  x: number;
  y: number;
  rotation: number;
  type: 'apple' | 'orange' | 'watermelon' | 'bomb';
  sliced: boolean;
}

export interface GameState {
  fruits: Fruit[];
  score: number;
  gameOver: boolean;
  lives: number;
  addFruit: (fruit: Fruit) => void;
  removeFruit: (id: string) => void;
  sliceFruit: (id: string) => void;
  incrementScore: () => void;
  decrementLives: () => void;
  resetGame: () => void;
}