import { useEffect, useRef, useState } from 'react';
import GameEngine from '../game/GameEngine';
import GameHUD from '../components/GameHUD';
import GameMenu from '../components/GameMenu';
import GameOver from '../components/GameOver';

export type GameState = 'menu' | 'playing' | 'gameover';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(
        containerRef.current,
        {
          onScoreUpdate: setScore,
          onHealthUpdate: setHealth,
          onLevelUpdate: setLevel,
          onGameOver: () => setGameState('gameover'),
        }
      );
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
        gameEngineRef.current = null;
      }
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setHealth(100);
    setLevel(1);
    if (gameEngineRef.current) {
      gameEngineRef.current.start();
    }
  };

  const pauseGame = () => {
    setIsPaused(true);
    if (gameEngineRef.current) {
      gameEngineRef.current.pause();
    }
  };

  const resumeGame = () => {
    setIsPaused(false);
    if (gameEngineRef.current) {
      gameEngineRef.current.resume();
    }
  };

  const restartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
    }
    startGame();
  };

  return (
    <div className="game-container scanlines">
      <div ref={containerRef} className="absolute inset-0" />
      
      {gameState === 'menu' && (
        <GameMenu onStart={startGame} />
      )}
      
      {gameState === 'playing' && (
        <>
          <GameHUD 
            score={score}
            health={health}
            level={level}
            onPause={pauseGame}
            onResume={resumeGame}
          />
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-orbitron font-bold text-neon-cyan neon-glow">
                  SYSTEM PAUSED
                </h2>
                <button
                  onClick={resumeGame}
                  className="cyber-button font-orbitron font-bold text-lg py-3 px-6"
                >
                  RESUME SEQUENCE
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {gameState === 'gameover' && (
        <GameOver 
          score={score}
          level={level}
          onRestart={restartGame}
          onMenu={() => setGameState('menu')}
        />
      )}
    </div>
  );
};

export default Index;