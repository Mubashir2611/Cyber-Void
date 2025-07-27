import * as PIXI from 'pixi.js';

export interface Enemy {
  sprite: PIXI.Graphics;
  health: number;
  maxHealth: number;
  velocity: { x: number; y: number };
  type: 'basic' | 'fast' | 'heavy';
  lastShot: number;
  shootRate: number;
}

export default class EnemyManager {
  private enemies: Enemy[] = [];
  private stage: PIXI.Container;
  private spawnTimer = 0;
  private baseSpawnRate = 2000; // milliseconds

  constructor(stage: PIXI.Container) {
    this.stage = stage;
  }

  private createEnemySprite(type: 'basic' | 'fast' | 'heavy'): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    
    switch (type) {
      case 'basic':
        graphics.beginFill(0xFF0080); // Pink
        graphics.drawPolygon([
          0, 15,     // Bottom point
          -8, -10,   // Top left
          -3, -5,    // Inner left
          0, -15,    // Top center
          3, -5,     // Inner right
          8, -10     // Top right
        ]);
        graphics.endFill();
        break;
        
      case 'fast':
        graphics.beginFill(0x8000FF); // Purple
        graphics.drawPolygon([
          0, 10,
          -6, -8,
          0, -12,
          6, -8
        ]);
        graphics.endFill();
        break;
        
      case 'heavy':
        graphics.beginFill(0xFF4000); // Orange-red
        graphics.drawRect(-12, -12, 24, 24);
        graphics.endFill();
        
        // Add armor plates
        graphics.beginFill(0x800000);
        graphics.drawRect(-10, -10, 20, 20);
        graphics.endFill();
        break;
    }
    
    return graphics;
  }

  private spawnEnemy(level: number) {
    // Determine enemy type based on level
    let type: 'basic' | 'fast' | 'heavy' = 'basic';
    const rand = Math.random();
    
    if (level >= 3 && rand < 0.3) {
      type = 'heavy';
    } else if (level >= 2 && rand < 0.5) {
      type = 'fast';
    }
    
    const sprite = this.createEnemySprite(type);
    sprite.x = Math.random() * (window.innerWidth - 60) + 30;
    sprite.y = -30;
    
    let health, velocity, shootRate;
    
    switch (type) {
      case 'basic':
        health = 25;
        velocity = { x: (Math.random() - 0.5) * 2, y: 1 + level * 0.2 };
        shootRate = 2000;
        break;
      case 'fast':
        health = 15;
        velocity = { x: (Math.random() - 0.5) * 4, y: 2 + level * 0.3 };
        shootRate = 1500;
        break;
      case 'heavy':
        health = 50;
        velocity = { x: (Math.random() - 0.5) * 1, y: 0.5 + level * 0.1 };
        shootRate = 3000;
        break;
    }
    
    const enemy: Enemy = {
      sprite,
      health,
      maxHealth: health,
      velocity,
      type,
      lastShot: Date.now(),
      shootRate
    };
    
    this.enemies.push(enemy);
    this.stage.addChild(sprite);
  }

  public update(deltaTime: number, level: number) {
    // Spawn enemies
    this.spawnTimer += deltaTime * 16.67;
    const spawnRate = this.baseSpawnRate / (1 + level * 0.2);
    
    if (this.spawnTimer >= spawnRate) {
      this.spawnEnemy(level);
      this.spawnTimer = 0;
    }
    
    // Update enemy positions and behavior
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      
      enemy.sprite.x += enemy.velocity.x;
      enemy.sprite.y += enemy.velocity.y;
      
      // Add slight movement patterns
      if (enemy.type === 'fast') {
        enemy.sprite.x += Math.sin(Date.now() * 0.01 + i) * 2;
      }
      
      // Remove enemies that are off screen
      if (enemy.sprite.y > window.innerHeight + 50) {
        this.removeEnemy(enemy);
        i--;
      }
    }
  }

  public damageEnemy(enemy: Enemy, damage: number): boolean {
    enemy.health -= damage;
    
    // Flash effect when hit
    enemy.sprite.tint = 0xFFFFFF;
    setTimeout(() => {
      if (enemy.sprite.parent) {
        enemy.sprite.tint = 0xFFFFFF;
      }
    }, 100);
    
    if (enemy.health <= 0) {
      this.removeEnemy(enemy);
      return true; // Enemy destroyed
    }
    return false;
  }

  public removeEnemy(enemy: Enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
      if (enemy.sprite.parent) {
        this.stage.removeChild(enemy.sprite);
      }
    }
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public reset() {
    for (const enemy of this.enemies) {
      if (enemy.sprite.parent) {
        this.stage.removeChild(enemy.sprite);
      }
    }
    this.enemies = [];
    this.spawnTimer = 0;
  }
}