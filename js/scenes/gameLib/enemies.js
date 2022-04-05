// @ts-check
import { BaseClass } from "./baseClass.js";
import c from "./colors.js";
import * as cg from "../../render/core/cg.js";

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
  constructor(model, initPosition, waveNumber, spawnTime) {
    super(model, initPosition);

    this.gravity = 2;
    this.acceleration = 0.2;
    this.maxSpeed = 0.5;

    this.waveNumber = waveNumber;
    this.spawnTime = spawnTime;

    this.id = enemyId++;
    enemies[this.id] = this;
  }

  accelerantEvent(typeChange) {
    switch (typeChange) {
      case "hit player":
        // move backwards a little, set velocity to max speed backwards
        break;
      case "move to player":
        // move towards player
        break;
      case "gravity":
        this.velocity[1] += -(this.gravity * this.model.deltaTime);
        break;
      default:
        break;
    }
  }
}

const scaleProperly = (entity, scale) => {
  entity.scale(scale, scale, scale);
}

export class Zombie extends Enemy {
  constructor(model, initPosition, waveNumber, spawnTime) {
    super(model, initPosition, waveNumber, spawnTime);

    const scale = .02;

    this.torso    = this.entity.add("cube")
                        .color(c.blue)
                        .move(0, 0, 0)
                        .scale(8, 10, 4) // proportions, scaled down later
    this.head     = this.entity.add("cube")
                        .color(c.red)
                        .move(0, 9*2, 0)
                        .scale(8, 8, 8) 
    this.leftArm  = this.entity.add("cube")
                        .color(c.green)
                        .move(6*2, -1, 0)
                        .scale(4, 11, 4)
    this.rightArm = this.entity.add("cube")
                        .color(c.purple)
                        .move(-6*2, -1, 0)
                        .scale(4, 11, 4)
    this.leftLeg  = this.entity.add("cube")
                        .color(c.orange)
                        .move(4, -(5+7.5)*2, 0)
                        .scale(4, 15, 4)
    this.rightLeg = this.entity.add("cube")
                        .color(c.yellow)
                        .move(-4, -(5+7.5)*2, 0)
                        .scale(4, 15, 4)
    this.foot = this.rightLeg.add();

    scaleProperly(this.entity, scale);
  }
}