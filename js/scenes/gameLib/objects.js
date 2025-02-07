// @ts-check
import { BaseClass } from "./baseClass.js";
import * as cg from "../../render/core/cg.js";
import c from "./colors.js";
import { getHUD } from "./hud.js";
import { Transparency } from "./transparency.js";
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

const deleteObject = (objectId) => {
  const object = physicsObjects[objectId];
  if (object !== undefined)
    object.delete();
}

export const state = {
    held: "held",
    stored: "stored",
    free: "free"
};

// object base class
export class GameObject extends BaseClass {
  static throwSmoothingSize = 3;

  constructor(model, root,  initPosition) {
    super(model, root, initPosition);

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
    smoothThrowVelocity[0] *= 1.5; // want the object to move faster
    smoothThrowVelocity[3] *= 1.5;
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
  constructor(model, root, initPosition) {
    super(model, root, initPosition);
    this.entityType = "Cube";

    this.entity.add("cube")
      .texture("media/textures/brick.png")
      .scale(0.1, 0.1, 0.1);
  }
}

export class Knife extends GameObject {
  constructor(model, root, initPosition) {
    super(model, root, initPosition);
    this.entityType = "Knife";
    this.defaultColor = c.black;
    this.isDeadly = true;
    this.fromInfiniteThrow = false;

    this.handle     = this.entity.add("tubeY")
                          .move(0, -0.03, 0)
                          .scale(0.02, 0.04, 0.02);
    this.crossguard = this.entity.add("cube")
                          .move(0, .02, 0)
                          .scale(0.06, 0.008, 0.02);
    this.blade      = this.entity.add("cube")
                          .move(0, 0.11, 0)
                          .scale(0.03, 0.10, 0.008);
    Transparency.addCube(this.id);
    // this.selectBox  = this.entity.add("cube")
    //                       .move(0, .07, 0)
    //                       .scale(0.12, 0.12, 0.12)
    //                       .opacity(.25);

    this.hitboxes = {
      blade: [
        { posOffset: [0, 0, 0], radius: getSize(this.blade, "Y") * 0.8 },
      ]
    };
  
  }

  delete() {
    Transparency.removeCube(this.id);
    super.delete();
  }

  makeTemporary() {
    this.fromInfiniteThrow = true;
    const id = this.id;
    setTimeout(() => deleteObject(id), 5000);
  }
}

class PowerUp extends GameObject {
  constructor(model, root, initPosition) {
    super(model, root, initPosition);
    this.entityType = "powerUp";
    this.powerUpType = "";
    this.extraHeight = .1;

    this.restitution = 1;

    this.entity.add("cube")
    this.entity.add("cube")
    this.entity.add("cube")
  }

  animate() {
    const cubes = this.entity._children;
    cubes[0].identity().scale(0.1, 0.1, 0.1)
    .turnX(2 * this.model.time).turnZ(2 * this.model.time);
    cubes[1].identity().scale(0.1, 0.1, 0.1)
    .turnZ(2 * this.model.time).turnY(2 * this.model.time);
    cubes[2].identity().scale(0.1, 0.1, 0.1)
    .turnY(2 * this.model.time).turnZ(2 * this.model.time);
  }

  activate() {
    // TODO play sound
    this.delete();
  }
}

export class HealthPickup extends PowerUp {
  constructor(model, root, initPosition) {
    super(model, root, initPosition);
    this.powerUpType = "health";
    this.defaultColor = c.red;
    this.hoverColor = c.pinkish;
    this.selectColor = c.darkRed;
  }

  activate() {
    getHUD().increaseHealth(5);
    super.activate();
  }
}

export class InfinitePower extends PowerUp {
  constructor(model, root, initPosition) {
    super(model, root, initPosition);
    this.powerUpType = "Infinite Throw";
    this.defaultColor = c.purple;
    this.hoverColor = c.lavender;
    this.selectColor = c.violet;
    this.duration = 10;
  }

  activate() {
    getHUD().setPower(this.powerUpType, this.duration);
    super.activate();
  }
}

export const removeTemporaryObjects = () => {
  Object.values(physicsObjects)
        .filter(obj => obj.fromInfiniteThrow)
        .forEach(obj => obj.delete());
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
