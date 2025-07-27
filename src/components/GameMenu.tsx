interface GameMenuProps {
  onStart: () => void;
}

const GameMenu = ({ onStart }: GameMenuProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
      <div className="text-center space-y-8 p-8">
        {/* Game Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-orbitron font-black text-neon-cyan neon-glow glitch">
            CYBERVOID
          </h1>
          <h2 className="text-2xl font-orbitron font-bold text-neon-pink neon-glow">
            NEON ASCENT
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg text-neon-purple font-tech max-w-md mx-auto">
          Navigate the neon-soaked void. Destroy enemies. Ascend through the digital darkness.
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="cyber-button text-xl font-orbitron font-bold py-4 px-8"
        >
          INITIALIZE SEQUENCE
        </button>

        {/* Controls */}
        <div className="hud-element max-w-md mx-auto mt-8">
          <h3 className="text-neon-cyan font-orbitron font-bold mb-4">CONTROLS</h3>
          <div className="space-y-2 text-sm font-tech text-foreground/80">
            <div>MOVEMENT: Arrow Keys / WASD</div>
            <div>FIRE: Spacebar (Hold for auto-fire)</div>
            <div>PAUSE: P</div>
          </div>
        </div>

        {/* Digital Effects */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-pink animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-neon-cyan animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-neon-purple animate-pulse"></div>
      </div>
    </div>
  );
};

export default GameMenu;