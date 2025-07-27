import * as PIXI from 'pixi.js';
import { Bullet } from './Player';
import { Enemy } from './EnemyManager';

export default class CollisionManager {
  public checkCollision(obj1: any, obj2: any): boolean {
    const sprite1 = obj1.sprite || obj1;
    const sprite2 = obj2.sprite || obj2;
    
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  public checkCircleCollision(
    x1: number, y1: number, radius1: number,
    x2: number, y2: number, radius2: number
  ): boolean {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (radius1 + radius2);
  }

  public getDistance(obj1: any, obj2: any): number {
    const sprite1 = obj1.sprite || obj1;
    const sprite2 = obj2.sprite || obj2;
    
    const dx = sprite1.x - sprite2.x;
    const dy = sprite1.y - sprite2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}