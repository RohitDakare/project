import { Swords } from 'lucide-react';
import Game from './components/Game';
import HandTracking from './components/HandTracking';
import { useGameStore } from './store';

function App() {
  const { gameOver, score, resetGame } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {gameOver ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Game Over!</h1>
          <p className="text-2xl text-white mb-8">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <Swords className="w-6 h-6" />
            Play Again
          </button>
        </div>
      ) : (
        <div className="relative w-[640px] h-[480px] bg-black/20 rounded-lg overflow-hidden">
          <HandTracking />
          <Game />
        </div>
      )}
    </div>
  );
}

export default App;