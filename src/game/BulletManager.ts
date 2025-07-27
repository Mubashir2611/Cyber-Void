import * as PIXI from 'pixi.js';
import { Bullet } from './Player';

export default class BulletManager {
  private playerBullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private stage: PIXI.Container;

  constructor(stage: PIXI.Container) {
    this.stage = stage;
  }

  public addPlayerBullet(bullet: Bullet) {
    this.playerBullets.push(bullet);
    this.stage.addChild(bullet.sprite);
  }

  public addEnemyBullet(bullet: Bullet) {
    this.enemyBullets.push(bullet);
    this.stage.addChild(bullet.sprite);
  }

  public update(deltaTime: number) {
    // Update player bullets
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const bullet = this.playerBullets[i];
      bullet.sprite.x += bullet.velocity.x;
      bullet.sprite.y += bullet.velocity.y;
      
      // Remove bullets that are off screen
      if (bullet.sprite.y < -20) {
        this.removePlayerBullet(bullet);
      }
    }
    
    // Update enemy bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      bullet.sprite.x += bullet.velocity.x;
      bullet.sprite.y += bullet.velocity.y;
      
      // Remove bullets that are off screen
      if (bullet.sprite.y > window.innerHeight + 20) {
        this.removeEnemyBullet(bullet);
      }
    }
  }

  public removePlayerBullet(bullet: Bullet) {
    const index = this.playerBullets.indexOf(bullet);
    if (index > -1) {
      this.playerBullets.splice(index, 1);
      if (bullet.sprite.parent) {
        this.stage.removeChild(bullet.sprite);
      }
    }
  }

  public removeEnemyBullet(bullet: Bullet) {
    const index = this.enemyBullets.indexOf(bullet);
    if (index > -1) {
      this.enemyBullets.splice(index, 1);
      if (bullet.sprite.parent) {
        this.stage.removeChild(bullet.sprite);
      }
    }
  }

  public getPlayerBullets(): Bullet[] {
    return this.playerBullets;
  }

  public getEnemyBullets(): Bullet[] {
    return this.enemyBullets;
  }

  public reset() {
    // Clear all bullets
    for (const bullet of this.playerBullets) {
      if (bullet.sprite.parent) {
        this.stage.removeChild(bullet.sprite);
      }
    }
    for (const bullet of this.enemyBullets) {
      if (bullet.sprite.parent) {
        this.stage.removeChild(bullet.sprite);
      }
    }
    
    this.playerBullets = [];
    this.enemyBullets = [];
  }
}