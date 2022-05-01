// @ts-check
import { BaseClass } from "./baseClass.js";
import * as cg from "../../render/core/cg.js";
import c from "./colors.js";
import { getHUD } from "./hud.js";
/*
   Object Model
   ------------
   X gravity modifier
   X restitution
   X bounding box
   X state = {held, stored, free}
   X storedSlot
   O x,y,z init scaling (probably need this)
   X current speed (current location - previous location)
*/

let objectID = 0;
export const physicsObjects = {};
/**
 * Removes a GameObject form the global physicsObjects object.
 * @param {GameObject} gameObject The game object you wish to remove
 */
export const removePhysicsObject = (gameObject) => {
  delete physicsObjects["" + gameObject.id];
}

export const state = {
    held: "held",
    stored: "stored",
    free: "free"
};

// object base class
export class GameObject extends BaseClass {
  static throwSmoothingSize = 3;

  constructor(model,  initPosition) {
    super(model, initPosition);

    this.state = state.free;
    this.storedSlot = null;
    this.handHeldIn = null; // left or right
    this.selectedBy = null; // left or right
    this.hoveredBy = null; // left or right
    this.isDeadly = false;

    this.restitution = 0.1;
    this.friction = 0.2;
    this.gravity = 2;

    this.defaultColor = c.white;
    this.hoverColor = c.orange;
    this.selectColor = c.redish;

    this.throwVelocities = [];
    
    this.extraHeight = 0;

    this.entityType = "GameObject";
    this.id = objectID++;
    physicsObjects[this.id] = this;
  }

  delete() {
    removePhysicsObject(this);
    super.delete();
  }

  appendThrowVelocity(velocity) {
    this.throwVelocities.push(velocity);
    if (this.throwVelocities.length > GameObject.throwSmoothingSize) {
      this.throwVelocities.shift();
    }
  }

  smoothThrow() {
    const totalVelocities = this.throwVelocities.reduce(
      (acc, curr) => cg.vadd(acc, curr)
    , cg.vZero());
    const smoothThrowVelocity = cg.scale(totalVelocities, 1/this.throwVelocities.length);
    this.setVelocity(smoothThrowVelocity);
  }

  resetThrowVelocities() {
    this.throwVelocities = [];
  }

  /**
   * @param {string} typeChange The name of the event to be applied
   */
  accelerantEvent(typeChange) {
    switch (typeChange) {
      case "bounce":
        this.velocity[1] = -this.velocity[1] * this.restitution;
        break;
      case "friction":
        this.velocity[0] = this.velocity[0] * (1-this.friction); // X
        this.velocity[2] = this.velocity[2] * (1-this.friction); // Z
        break;
      case "gravity":
        this.velocity[1] += -(this.gravity * this.model.deltaTime);
        break;
      default:
        break;
    }
  }

}

export class Cube extends GameObject {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.entityType = "Cube";

    this.entity.add("cube")
      .texture("media/textures/brick.png")
      .scale(0.1, 0.1, 0.1);
  }
}

export class Knife extends GameObject {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.entityType = "Knife";
    this.defaultColor = c.black;
    this.isDeadly = true;

    this.handle     = this.entity.add("tubeY")
                          .move(0, -0.03, 0)
                          .scale(0.02, 0.04, 0.02);
    this.crossguard = this.entity.add("cube")
                          .move(0, .02, 0)
                          .scale(0.06, 0.008, 0.02);
    this.blade      = this.entity.add("cube")
                          .move(0, 0.11, 0)
                          .scale(0.03, 0.10, 0.008);

    this.hitboxes = {
      blade: [
        { posOffset: [0, 0, 0], radius: getSize(this.blade, "Y") * 0.8 },
      ]
    };
  
  }
}

class PowerUp extends GameObject {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.entityType = "powerUp";
    this.powerUpType = "";
    this.extraHeight = .1;

    this.entity.add("cube")
    this.entity.add("cube")
    this.entity.add("cube")
  }

  animate() {
    const cubes = this.entity._children;
    cubes[0].identity().scale(0.1, 0.1, 0.1)
    .turnX(3 * this.model.time).turnZ(this.model.time/2);
    cubes[1].identity().scale(0.1, 0.1, 0.1)
    .turnZ(3 * this.model.time).turnY(this.model.time/2);
    cubes[2].identity().scale(0.1, 0.1, 0.1)
    .turnY(3 * this.model.time).turnZ(this.model.time/2);
  }

  activate() {
    this.delete();
  }
}

export class HealthPickup extends PowerUp {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.powerUpType = "health";
    this.defaultColor = c.red;
    this.hoverColor = c.pinkish;
    this.selectColor = c.darkRed;
  }

  activate() {
    super.activate();
    getHUD().increaseHealth(5);
  }
}

export class InfinitePower extends PowerUp {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.powerUpType = "Infinite Throw";
    this.defaultColor = c.purple;
    this.hoverColor = c.lavender;
    this.selectColor = c.violet;
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
