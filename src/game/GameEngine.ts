import * as PIXI from 'pixi.js';
import * as THREE from 'three';
import Player from './Player';
import EnemyManager from './EnemyManager';
import BulletManager from './BulletManager';
import Background3D from './Background3D';
import AudioManager from './AudioManager';
import CollisionManager from './CollisionManager';

export interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onHealthUpdate: (health: number) => void;
  onLevelUpdate: (level: number) => void;
  onGameOver: () => void;
}

export default class GameEngine {
  private app: PIXI.Application;
  private scene3D: THREE.Scene;
  private camera3D: THREE.PerspectiveCamera;
  private renderer3D: THREE.WebGLRenderer;
  private background3D: Background3D;
  
  private player: Player;
  private enemyManager: EnemyManager;
  private bulletManager: BulletManager;
  private audioManager: AudioManager;
  private collisionManager: CollisionManager;
  
  private callbacks: GameCallbacks;
  private isRunning = false;
  private isPaused = false;
  
  private score = 0;
  private level = 1;
  private lastTime = 0;

  constructor(container: HTMLElement, callbacks: GameCallbacks) {
    this.callbacks = callbacks;
    
    // Initialize PIXI application
    this.app = new PIXI.Application();
    this.init(container);
  }

  private async init(container: HTMLElement) {
    await this.initPixi(container);
    
    // Initialize Three.js
    this.scene3D = new THREE.Scene();
    this.camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer3D = new THREE.WebGLRenderer({ alpha: true });
    this.initThreeJS(container);
    
    // Initialize game components
    this.background3D = new Background3D(this.scene3D);
    this.player = new Player(this.app.stage);
    this.bulletManager = new BulletManager(this.app.stage);
    this.enemyManager = new EnemyManager(this.app.stage);
    this.audioManager = new AudioManager();
    this.collisionManager = new CollisionManager();
    
    this.setupEventListeners();
  }

  private async initPixi(container: HTMLElement) {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
    });
    
    this.app.canvas.style.position = 'absolute';
    this.app.canvas.style.top = '0';
    this.app.canvas.style.left = '0';
    this.app.canvas.style.zIndex = '2';
    container.appendChild(this.app.canvas);
  }

  private initThreeJS(container: HTMLElement) {
    this.renderer3D.setSize(window.innerWidth, window.innerHeight);
    this.renderer3D.domElement.style.position = 'absolute';
    this.renderer3D.domElement.style.top = '0';
    this.renderer3D.domElement.style.left = '0';
    this.renderer3D.domElement.style.zIndex = '1';
    container.appendChild(this.renderer3D.domElement);
    
    this.camera3D.position.z = 5;
  }

  private setupEventListeners() {
    // Keyboard controls
    const keys: { [key: string]: boolean } = {};
    
    window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        this.player.startShooting();
      }
      if (e.code === 'KeyP' && this.isRunning) {
        e.preventDefault();
        if (this.isPaused) {
          this.resume();
        } else {
          this.pause();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
      if (e.code === 'Space') {
        this.player.stopShooting();
      }
    });

    // Update player movement based on keys
    this.app.ticker.add(() => {
      if (!this.isRunning || this.isPaused) return;
      
      const moveSpeed = 5;
      if (keys['ArrowLeft'] || keys['KeyA']) {
        this.player.move(-moveSpeed, 0);
      }
      if (keys['ArrowRight'] || keys['KeyD']) {
        this.player.move(moveSpeed, 0);
      }
      if (keys['ArrowUp'] || keys['KeyW']) {
        this.player.move(0, -moveSpeed);
      }
      if (keys['ArrowDown'] || keys['KeyS']) {
        this.player.move(0, moveSpeed);
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.renderer3D.setSize(window.innerWidth, window.innerHeight);
      this.camera3D.aspect = window.innerWidth / window.innerHeight;
      this.camera3D.updateProjectionMatrix();
    });
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.score = 0;
    this.level = 1;
    
    this.player.reset();
    this.enemyManager.reset();
    this.bulletManager.reset();
    this.audioManager.playBackgroundMusic();
    
    this.app.ticker.add(this.gameLoop.bind(this));
    this.animate3D();
  }

  public pause() {
    this.isPaused = true;
    this.audioManager.pauseBackgroundMusic();
  }

  public resume() {
    this.isPaused = false;
    this.audioManager.resumeBackgroundMusic();
  }

  public restart() {
    this.isRunning = false;
    this.isPaused = false;
    this.app.ticker.remove(this.gameLoop.bind(this));
  }

  private gameLoop(ticker: PIXI.Ticker) {
    if (!this.isRunning || this.isPaused) return;

    const deltaTime = ticker.deltaTime;
    
    // Update game objects
    this.player.update(deltaTime);
    this.enemyManager.update(deltaTime, this.level);
    this.bulletManager.update(deltaTime);
    
    // Handle player shooting
    if (this.player.isShooting) {
      const bullet = this.player.shoot();
      if (bullet) {
        this.bulletManager.addPlayerBullet(bullet);
      }
    }
    
    // Handle collisions
    this.handleCollisions();
    
    // Update score and level
    this.updateGameState();
  }

  private animate3D() {
    if (!this.isRunning) return;
    
    requestAnimationFrame(() => this.animate3D());
    
    if (!this.isPaused) {
      this.background3D.update();
    }
    
    this.renderer3D.render(this.scene3D, this.camera3D);
  }

  private handleCollisions() {
    // Player bullets vs enemies
    const playerBullets = this.bulletManager.getPlayerBullets();
    const enemies = this.enemyManager.getEnemies();
    
    for (const bullet of playerBullets) {
      for (const enemy of enemies) {
        if (this.collisionManager.checkCollision(bullet, enemy)) {
          this.bulletManager.removePlayerBullet(bullet);
          if (this.enemyManager.damageEnemy(enemy, 25)) {
            this.score += 100;
            this.audioManager.playEnemyDeath();
          }
          break;
        }
      }
    }
    
    // Enemy bullets vs player
    const enemyBullets = this.bulletManager.getEnemyBullets();
    for (const bullet of enemyBullets) {
      if (this.collisionManager.checkCollision(bullet, this.player.getSprite())) {
        this.bulletManager.removeEnemyBullet(bullet);
        this.player.takeDamage(10);
        this.audioManager.playPlayerHit();
        
        if (this.player.getHealth() <= 0) {
          this.gameOver();
          return;
        }
        break;
      }
    }
    
    // Enemies vs player
    for (const enemy of enemies) {
      if (this.collisionManager.checkCollision(enemy, this.player.getSprite())) {
        this.player.takeDamage(20);
        this.enemyManager.removeEnemy(enemy);
        this.audioManager.playPlayerHit();
        
        if (this.player.getHealth() <= 0) {
          this.gameOver();
          return;
        }
        break;
      }
    }
  }

  private updateGameState() {
    // Update callbacks
    this.callbacks.onScoreUpdate(this.score);
    this.callbacks.onHealthUpdate(this.player.getHealth());
    
    // Level progression
    const newLevel = Math.floor(this.score / 1000) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.callbacks.onLevelUpdate(this.level);
      this.audioManager.playLevelUp();
    }
  }

  private gameOver() {
    this.isRunning = false;
    this.audioManager.stopBackgroundMusic();
    this.audioManager.playGameOver();
    this.callbacks.onGameOver();
  }

  public destroy() {
    this.isRunning = false;
    this.app.destroy(true);
    this.renderer3D.dispose();
    this.audioManager.destroy();
  }
}