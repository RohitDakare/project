import { useEffect, useRef, useState } from 'react';
import { Engine, Render, World, Bodies, Body } from 'matter-js';
import { useGameStore } from '../store';

interface Fruit {
  id: number;
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  type: string;
  size: number;
}

const FRUITS = ['🍎', '🍊', '🍌', '🍉', '🍇'];
const BOMB = '💣';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef(Engine.create({ gravity: { y: 0.6 } }));
  const { gameOver, setGameOver } = useGameStore();
  const [fruits, setFruits] = useState<Fruit[]>([]);

  const addFruit = (fruit: Fruit) => {
    setFruits(prev => [...prev, fruit]);
  };

  const removeFruit = (id: number) => {
    setFruits(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engineRef.current,
      options: {
        width: 640,
        height: 480,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    // Create invisible walls
    const walls = [
      Bodies.rectangle(320, -10, 640, 20, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(320, 490, 640, 20, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(-10, 240, 20, 480, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(650, 240, 20, 480, { isStatic: true, render: { visible: false } }),
    ];
    World.add(engineRef.current.world, walls);

    const spawnFruit = () => {
      const types = ['apple', 'orange', 'watermelon', 'bomb'] as const;
      const type = types[Math.floor(Math.random() * types.length)];
      const x = Math.random() * 540 + 50;
      const size = type === 'watermelon' ? 35 : 25;
      const fruit: Fruit = {
        id: Math.floor(Math.random() * 1000000),
        x,
        y: 500,
        type,
        speedX: (Math.random() - 0.5) * 8,
        speedY: -12 - Math.random() * 4,
        size,
      };
      addFruit(fruit);

      const body = Bodies.circle(x, 500, size, {
        restitution: 0.6,
        friction: 0.005,
        render: {
          fillStyle: getFruitColor(type),
          strokeStyle: '#ffffff',
          lineWidth: 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: -12 - Math.random() * 4,
        },
      });

      World.add(engineRef.current.world, body);

      // Update fruit position for collision detection
      Body.setPosition(body, { x, y: 500 });

      // Remove fruits that fall below the screen
      setTimeout(() => {
        World.remove(engineRef.current.world, body);
        removeFruit(fruit.id);
      }, 6000);
    };

    const getFruitColor = (type: Fruit['type']) => {
      switch (type) {
        case 'apple':
          return '#ff0000';
        case 'orange':
          return '#ffa500';
        case 'watermelon':
          return '#ff2d55';
        case 'bomb':
          return '#000000';
      }
    };

    const gameLoop = setInterval(spawnFruit, 1500); // Slightly slower spawn rate
    Engine.run(engineRef.current);
    Render.run(render);

    return () => {
      clearInterval(gameLoop);
      World.clear(engineRef.current.world, false);
      Engine.clear(engineRef.current);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  // Spawn new fruits
  useEffect(() => {
    if (gameOver) return;
    
    const spawnInterval = setInterval(() => {
      const isBomb = Math.random() < 0.2;
      const newFruit: Fruit = {
        id: Date.now(),
        x: Math.random() * window.innerWidth * 0.8,
        y: window.innerHeight,
        speedY: -15 - Math.random() * 5,
        speedX: (Math.random() - 0.5) * 5,
        type: isBomb ? BOMB : FRUITS[Math.floor(Math.random() * FRUITS.length)],
        size: 40
      };
      
      setFruits(prev => [...prev, newFruit]);
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gameLoop = () => {
      if (gameOver) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setFruits(prevFruits => {
        return prevFruits
          .map(fruit => ({
            ...fruit,
            y: fruit.y + fruit.speedY,
            x: fruit.x + fruit.speedX,
            speedY: fruit.speedY + 0.5, // gravity
          }))
          .filter(fruit => fruit.y < window.innerHeight + 100);
      });

      // Draw fruits
      fruits.forEach(fruit => {
        ctx.font = `${fruit.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fruit.type, fruit.x, fruit.y);
      });

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [fruits, gameOver, setGameOver]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20 z-0" />
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-20 bg-black/30 px-3 py-1 rounded">
        Score: {useGameStore((state) => state.score)}
      </div>
      <div className="absolute top-4 right-4 text-white text-2xl font-bold z-20 bg-black/30 px-3 py-1 rounded">
        Lives: {useGameStore((state) => state.lives)}
      </div>
    </div>
  );
};

export default Game;
