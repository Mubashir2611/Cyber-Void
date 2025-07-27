import * as PIXI from 'pixi.js';

export interface Bullet {
  sprite: PIXI.Graphics;
  velocity: { x: number; y: number };
}

export default class Player {
  private sprite: PIXI.Graphics;
  private health = 100;
  private maxHealth = 100;
  private shootCooldown = 0;
  private shootRate = 150; // milliseconds between shots
  public isShooting = false;

  constructor(stage: PIXI.Container) {
    this.sprite = this.createPlayerSprite();
    stage.addChild(this.sprite);
    this.reset();
  }

  private createPlayerSprite(): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    
    // Create a cyberpunk ship design
    graphics.beginFill(0x00FFFF); // Cyan
    graphics.drawPolygon([
      0, -20,    // Top point
      -10, 10,   // Bottom left
      -5, 5,     // Inner left
      0, 15,     // Bottom center
      5, 5,      // Inner right
      10, 10     // Bottom right
    ]);
    graphics.endFill();
    
    // Add glow effect
    graphics.beginFill(0xFF00FF, 0.3); // Pink glow
    graphics.drawPolygon([
      0, -25,
      -15, 15,
      -8, 8,
      0, 20,
      8, 8,
      15, 15
    ]);
    graphics.endFill();
    
    // Add engine trails
    graphics.beginFill(0x0080FF); // Blue trails
    graphics.drawRect(-3, 15, 2, 8);
    graphics.drawRect(1, 15, 2, 8);
    graphics.endFill();

    return graphics;
  }

  public move(deltaX: number, deltaY: number) {
    this.sprite.x += deltaX;
    this.sprite.y += deltaY;
    
    // Keep player on screen
    const margin = 30;
    this.sprite.x = Math.max(margin, Math.min(window.innerWidth - margin, this.sprite.x));
    this.sprite.y = Math.max(margin, Math.min(window.innerHeight - margin, this.sprite.y));
  }

  public startShooting() {
    this.isShooting = true;
  }

  public stopShooting() {
    this.isShooting = false;
  }

  public shoot(): Bullet | null {
    if (this.shootCooldown > 0) return null;
    
    this.shootCooldown = this.shootRate;
    
    const bullet = new PIXI.Graphics();
    bullet.beginFill(0x00FFFF); // Cyan bullet
    bullet.drawRect(-2, -8, 4, 16);
    bullet.endFill();
    
    // Add glow
    bullet.beginFill(0x00FFFF, 0.3);
    bullet.drawRect(-4, -10, 8, 20);
    bullet.endFill();
    
    bullet.x = this.sprite.x;
    bullet.y = this.sprite.y - 20;
    
    return {
      sprite: bullet,
      velocity: { x: 0, y: -10 }
    };
  }

  public update(deltaTime: number) {
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime * 16.67; // Convert to milliseconds
    }
    
    // Add slight bobbing animation
    this.sprite.y += Math.sin(Date.now() * 0.005) * 0.3;
  }

  public takeDamage(damage: number) {
    this.health = Math.max(0, this.health - damage);
    
    // Screen shake effect
    this.sprite.x += (Math.random() - 0.5) * 10;
    this.sprite.y += (Math.random() - 0.5) * 10;
  }

  public getHealth(): number {
    return this.health;
  }

  public getSprite(): PIXI.Graphics {
    return this.sprite;
  }

  public reset() {
    this.health = this.maxHealth;
    this.sprite.x = window.innerWidth / 2;
    this.sprite.y = window.innerHeight - 100;
    this.shootCooldown = 0;
    this.isShooting = false;
  }
}
