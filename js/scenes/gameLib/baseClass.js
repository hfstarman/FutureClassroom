import * as cg from "../../render/core/cg.js";

export class BaseClass {
  constructor(model,  initPosition) {
    if (initPosition === undefined) initPosition = [0, 1.5, 0];
    this.initPosition = initPosition;
    this.model = model;
    this.entity = model.add();
    this.entity.move(initPosition);
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
}