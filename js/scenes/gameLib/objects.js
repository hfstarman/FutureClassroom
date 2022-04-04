// @ts-check
import { BaseClass } from "./baseClass.js";
import * as cg from "../../render/core/cg.js";
import c from "./colors.js";
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
  constructor(model,  initPosition) {
    super(model, initPosition);

    this.state = state.free;
    this.storedSlot = null;
    this.handHeldIn = null; // left or right
    this.selectedBy = null; // left or right
    this.hoveredBy = null; // left or right

    this.restitution = 0.1;
    this.friction = 0.2;
    this.gravity = 0.05;

    this.defaultColor = c.white;
    this.hoverColor = c.orange;
    this.selectColor = c.redish;

    this.entityType = "GameObject";
    this.id = objectID++;
    physicsObjects[this.id] = this;
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

    this.handle     = this.entity.add("tubeY")
                          .move(0, -0.03, 0)
                          .scale(0.02, 0.04, 0.02);
    this.crossguard = this.entity.add("cube")
                          .move(0, .02, 0)
                          .scale(0.06, 0.008, 0.02);
    this.blade      = this.entity.add("cube")
                          .move(0, 0.11, 0)
                          .scale(0.03, 0.10, 0.008);
  }
}
