// @ts-check
import { BaseClass } from "./baseClass.js";
import c from "./colors.js";
import * as cg from "../../render/core/cg.js";

let enemyId = 0;
export const enemies = {};
export const removeEnemy = (enemy) => {
  delete enemies["" + enemy.id];
}

export const getLiveEnemies = () => (
  Object.values(enemies).filter(e => e.state === "alive")
);
// enemy has to spawn at a certain time
// enemy has to move towards player (and turning accordingly)
// enemy has to deal damage to player when nearby
// enemy can't be in the same space as another enemy

class Enemy extends BaseClass {
  constructor(model, initPosition) {
    super(model, initPosition);

    this.gravity = 2;
    this.acceleration = 0.2;
    this.maxSpeed = 0.5;
    this.grounded = false;

    this.state = "alive"; // alive, dead
    // this.waveNumber = waveNumber;
    // this.spawnTime = spawnTime;
    this.damage = 1;
    this.strideAngle = Math.PI/12;
    this.scoreValue = 100;

    this.id = enemyId++;
    enemies[this.id] = this;
  }

  delete() {
    removeEnemy(this);
    super.delete();
  }

  death() {
    // TODO play death sound
    this.state = "dead";
    this.delete();
  }

  accelerantEvent(typeChange) {
    switch (typeChange) {
      case "hit player":
        // move backwards a little, set velocity to max speed backwards
        this.velocity = cg.scale(this.velocity, -1);
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
  constructor(model, initPosition) {
    super(model, initPosition);

    const scale = .02;

    this.torso      = this.entity.add("cube")
                          .move(0, 0, 0)
                          .scale(8, 10, 4) // proportions, scaled down later
    this.head       = this.entity.add("cube")
                          .move(0, 9*2, 0)
                          .scale(8, 8, 8) 
    this.armJointL  = this.entity.add()
                          .move(6*2, 3*2, 0)
    this.armL       = this.armJointL.add("cube")
                          .move(0, -7, 0)
                          .scale(4, 11, 4)
    this.armJointR  = this.entity.add()
                          .move(-6*2, 3*2, 0)
    this.armR       = this.armJointR.add("cube")
                          .move(0, -7, 0)
                          .scale(4, 11, 4)
    this.legJointL  = this.entity.add()
                          .move(4, -10, 0)
    this.legL       = this.legJointL.add("cube")
                          .move(0, -15, 0)
                          .scale(3.99, 15, 3.99)
    this.legJointR  = this.entity.add()
                          .move(-4, -10, 0)
    this.legR       = this.legJointR.add("cube")
                          .move(0, -15, 0)
                          .scale(3.99, 15, 3.99)
    this.foot       = this.legR.add();

    scaleProperly(this.entity, scale);
    const armLength = this.armL.getGlobalMatrix()[5]*2;
    // put the arms up
    this.armJointL.turnX(-Math.PI/2);
    this.armJointR.turnX(-Math.PI/2);

    // this.legJointL.turnX(-Math.PI/12);
    // this.legJointR.turnX(Math.PI/12);
    const legLength = this.legL.getGlobalMatrix()[5]*2;
    this.strideLength = 2 * legLength * Math.sin(this.strideAngle);
    
    this.attackRange = armLength;
    this.hitboxes = {
      head: [
        {posOffset: [0, 0, 0], radius: getSize(this.head, "Y") * Math.sqrt(2)},
      ],
      torso: [
        {posOffset: [0, 0, 0], radius: getSize(this.torso, "Y") * 1.8},
        {posOffset: [0, -(getSize(this.torso, "Y") * 3), 0], radius: getSize(this.torso, "Y") * .8},
      ],
    }
    this.entity.color(c.zombieGreen);
  }
}

export class FastZombie extends Zombie {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.entity.color(c.darkRed);

    this.acceleration = 0.8;
    this.maxSpeed = 1.0;

    this.scoreValue = 175;
  }
}

export class ArmoredZombie extends Zombie {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.entity.color(c.lightGray);

    this.unarmoredColor = c.darkZombieGreen;
    this.hasArmor = true;
    this.damage = 3;
    this.maxSpeed = 0.4;

    this.scoreValue = 250;
  }

  removeArmor() {
    // TODO play armor break sound
    this.hasArmor = false;
    this.entity.color(this.unarmoredColor);
  }
}

/**
 * @param {string} plane 'X', 'Y', or 'Z'
 */
 const getSize = (entity, plane) => {
  switch (plane.toLowerCase()) {
    case "x":
      return entity.getGlobalMatrix()[0];
    case "y":
      return entity.getGlobalMatrix()[5];
    case "z":
      return entity.getGlobalMatrix()[10];
    default:
      throw new Error("Invalid plane");
  }
}