interface GameOverProps {
  score: number;
  level: number;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOver = ({ score, level, onRestart, onMenu }: GameOverProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10">
      <div className="text-center space-y-8 p-8 max-w-md">
        {/* Game Over Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-orbitron font-black text-warning neon-glow glitch">
            SYSTEM FAILURE
          </h1>
          <div className="text-lg font-tech text-neon-cyan">
            CONNECTION TERMINATED
          </div>
        </div>

        {/* Stats */}
        <div className="hud-element space-y-4">
          <h2 className="text-xl font-orbitron font-bold text-neon-pink mb-4">
            FINAL TRANSMISSION
          </h2>
          <div className="space-y-2 font-tech">
            <div className="flex justify-between">
              <span className="text-neon-cyan">SCORE:</span>
              <span className="text-neon-pink font-bold">{score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neon-cyan">LEVEL REACHED:</span>
              <span className="text-neon-purple font-bold">{level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neon-cyan">ENEMIES DESTROYED:</span>
              <span className="text-neon-green font-bold">{Math.floor(score / 100)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="cyber-button w-full font-orbitron font-bold py-3"
          >
            REINITIALIZE SEQUENCE
          </button>
          <button
            onClick={onMenu}
            className="cyber-button w-full font-orbitron font-bold py-3 bg-secondary/20 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
          >
            RETURN TO MAIN TERMINAL
          </button>
        </div>

        {/* Performance Rating */}
        <div className="hud-element">
          <div className="font-orbitron font-bold text-neon-cyan mb-2">
            PERFORMANCE RATING
          </div>
          <div className="text-2xl font-orbitron font-black">
            {score < 1000 ? (
              <span className="text-warning">NOVICE</span>
            ) : score < 5000 ? (
              <span className="text-neon-purple">OPERATIVE</span>
            ) : score < 10000 ? (
              <span className="text-neon-cyan">VETERAN</span>
            ) : (
              <span className="text-neon-pink">LEGENDARY</span>
            )}
          </div>
        </div>

        {/* Glitch effects */}
        <div className="absolute top-1/4 left-0 w-1 h-8 bg-warning animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/4 right-0 w-1 h-4 bg-neon-pink animate-pulse opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-cyan animate-pulse opacity-40"></div>
      </div>
    </div>
  );
};

export default GameOver;