interface GameHUDProps {
  score: number;
  health: number;
  level: number;
  onPause: () => void;
  onResume: () => void;
}

const GameHUD = ({ score, health, level, onPause, onResume }: GameHUDProps) => {
  const healthPercentage = Math.max(0, (health / 100) * 100);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Score and Level */}
        <div className="hud-element">
          <div className="font-orbitron font-bold text-neon-cyan">
            SCORE: <span className="text-neon-pink">{score.toLocaleString()}</span>
          </div>
          <div className="font-orbitron font-bold text-neon-cyan mt-1">
            LEVEL: <span className="text-neon-purple">{level}</span>
          </div>
        </div>

        {/* Health Bar */}
        <div className="hud-element min-w-[200px]">
          <div className="font-orbitron font-bold text-neon-cyan mb-2">
            INTEGRITY: {health}%
          </div>
          <div className="w-full bg-muted h-3 rounded cyber-border">
            <div 
              className={`h-full rounded transition-all duration-300 ${
                health > 60 ? 'bg-energy-bar' : 
                health > 30 ? 'bg-yellow-500' : 'bg-warning'
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Pause Button */}
        <button
          onClick={onPause}
          className="cyber-button font-orbitron font-bold"
        >
          PAUSE
        </button>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neon-cyan pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neon-cyan pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neon-pink pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neon-pink pointer-events-none"></div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-6 h-0.5 bg-neon-cyan/50"></div>
        <div className="w-0.5 h-6 bg-neon-cyan/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Digital noise effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default GameHUD;