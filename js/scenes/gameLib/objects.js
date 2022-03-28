// @ts-check
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
export const removePhysicsObject = (gameObject) => {
  delete physicsObjects[gameObject.id];
}

export const state = {
    held: "held",
    stored: "stored",
    free: "free"
};

// object base class
export class GameObject {
  constructor(model,  initPosition) {
    if (initPosition === undefined) initPosition = [0, 1.5, 0];
    this.initPosition = initPosition;
    this.model = model;
    this.entity = model.add();
    this.entity.move(initPosition);

    this.state = state.free;
    this.storedSlot = null;
    this.handHeldIn = null; // left or right
    this.selectedBy = null; // left or right
    this.hoveredBy = null; // left or right

    this.restitution = 0.1;
    this.friction = 0.2;
    this.gravity = 0.05;

    this.velocity = cg.vZero();

    this.id = objectID++;
    physicsObjects[this.id] = this;
  }

  getMatrix() {
    return this.entity.getMatrix();
  }

  setMatrix(m) {
    return this.entity.setMatrix(m);
  }

  getPos() {
    return cg.getPos(this.getMatrix());
  }

  applyTransform(m) {
    this.setMatrix(cg.mm(this.getMatrix(), m));
  }

  applyVelocity() {
    this.applyTransform(cg.mTranslate(this.velocity));
  }

  addVelocity(v) {
    this.velocity = cg.vadd(this.velocity, v);
  }

  setVelocity(v) {
    this.velocity = v;
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

/*
this.entity.add("tubeY")
  .color(this.defaultColor)
  .turnX(radians)
  .move(0, 0.5, 0)
  .scale(0.1, 0.1, 0.1);
*/

export class Cube extends GameObject {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.defaultColor = c.white;

    this.entity.add("cube");
    this.entity.texture("media/textures/brick.png");
    this.entity.scale(0.1, 0.1, 0.1);
  }
}

export class Knife extends GameObject {
  constructor(model, initPosition) {
    super(model, initPosition);
    this.defaultColor = c.black;
    // this.currentColor = c.black;
    this.gravity = 0;

    this.entity.add("tubeY")
      .color(c.black)
      .move(0, -0.03, 0)
      .scale(0.02, 0.04, 0.02);
    this.entity.add("cube")
      .color(c.black)
      .move(0, .02, 0)
      .scale(0.06, 0.008, 0.02);
    this.entity.add("cube")
      .color(c.black)
      .move(0, 0.11, 0)
      .scale(0.03, 0.10, 0.008);
  }
}
