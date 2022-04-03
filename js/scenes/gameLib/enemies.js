import { BaseClass } from "./baseClass.js";

let enemyId = 0;
export const enemies = {};
export const removeEnemy = (enemy) => {
  delete enemies["" + enemy.id];
}

// enemy has to spawn at a certain time
// enemy has to move towards player (and turning accordingly)
// enemy has to deal damage to player when nearby
// enemy can't be in the same space as another enemy

class Enemy extends BaseClass {
  constructor(model, initPosition, spawnTime) {
    super(model, initPosition);

    this.spawnTime = spawnTime;

    this.id = enemyId++;
    enemies[this.id] = this;
  }
}

export class Zombie extends Enemy {
  constructor(model, initPosition, spawnTime) {
    super(model, initPosition, spawnTime);


    this.head     = this.entity.add("cube")
                        .color(c.red)
                        .move(0, 0.5, 0)
                        .scale(0.1, 0.1, 0.1)
    this.torso    = this.entity.add("cube")
                        .color(c.red)
                        .move(0, 0, 0)
                        .scale(0.1, 0.1, 0.1)
    this.leftArm  = this.entity.add("cube")
                        .color(c.red)
                        .move(0, 0.5, 0)
                        .scale(0.1, 0.1, 0.1)
    this.rightArm = this.entity.add("cube")
                        .color(c.red)
                        .move(0, 0.5, 0)
                        .scale(0.1, 0.1, 0.1)
    this.leftLeg  = this.entity.add("cube")
                        .color(c.red)
                        .move(0, 0.5, 0)
                        .scale(0.1, 0.1, 0.1)
    this.rightLeg = this.entity.add("cube")
                        .color(c.red)
                        .move(0, 0.5, 0)
                        .scale(0.1, 0.1, 0.1)
  }
}