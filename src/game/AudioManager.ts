export default class AudioManager {
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: { [key: string]: HTMLAudioElement } = {};
  private isMuted = false;

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    // In a real implementation, you would load actual audio files
    // For now, we'll use the Web Audio API to generate synthetic sounds
  }

  public playBackgroundMusic() {
    // Placeholder for background music
    console.log('Playing background music');
  }

  public pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  public resumeBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }
  }

  public stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  public playEnemyDeath() {
    this.playBeep(800, 0.1, 0.2);
  }

  public playPlayerHit() {
    this.playBeep(200, 0.2, 0.3);
  }

  public playLevelUp() {
    this.playBeep(1200, 0.3, 0.4);
  }

  public playGameOver() {
    this.playBeep(300, 1.0, 0.5);
  }

  private playBeep(frequency: number, duration: number, volume: number = 0.3) {
    if (this.isMuted) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.backgroundMusic) {
      this.backgroundMusic.volume = 0;
    } else if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.5;
    }
  }

  public destroy() {
    this.stopBackgroundMusic();
  }
}