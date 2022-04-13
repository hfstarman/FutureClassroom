// @ts-check
import * as cg from "../../render/core/cg.js";

let globalId = 0;

export class BaseClass {
  constructor(model,  initPosition) {
    if (initPosition === undefined) initPosition = [0, 1.5, 0];
    this.initPosition = initPosition;
    this.model = model;
    this.entity = model.add();
    this.entity.move(initPosition);
    
    this.velocity = cg.vZero();
    
    this.entityType = "None";
    this.entity.globalId = globalId++;
    this.id = null;
  }

  getName() {
    return this.entityType + "_" + this.id;
  }

  delete() {
    const parentsChildren = this.entity._parent._children;
    const myId = this.entity.globalId;
    for (let i = 0; i < parentsChildren.length; i++) {
      if (parentsChildren[i].globalId === myId) {
        parentsChildren.splice(i, 1);
        break;
      }
    }
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

  getDeltaPos() {
    return cg.scale(this.velocity, this.model.deltaTime);
  }

  applyVelocity() {
    const dp = this.getDeltaPos();
    this.applyTransform(cg.mTranslate(dp));
  }

  addVelocity(v) {
    this.velocity = cg.vadd(this.velocity, v);
  }

  setVelocity(v) {
    this.velocity = v;
  }

  resetVelocity() {
    this.velocity = cg.vZero();
  }

  accelerantEvent(typeChange) {
    throw new Error("AccelerantEvent not implemented in BaseClass");
  }
}