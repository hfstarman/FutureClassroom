// @ts-check
import * as cg from "../../render/core/cg.js";

export class BaseClass {
  constructor(model,  initPosition) {
    if (initPosition === undefined) initPosition = [0, 1.5, 0];
    this.initPosition = initPosition;
    this.model = model;
    this.entity = model.add();
    this.entity.move(initPosition);

    this.velocity = cg.vZero();

    this.entityType = "None";
    this.id = null;
  }

  getName() {
    return this.entityType + "_" + this.id;
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

  accelerantEvent(typeChange) {
    throw new Error("AccelerantEvent not implemented in BaseClass");
  }
}