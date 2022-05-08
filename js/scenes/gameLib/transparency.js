// @ts-check
import { physicsObjects } from "./objects.js";

export class Transparency {
  static cubes = {};
  static model = null;
  static root = null;
  static id = 0;

  static init(model) {
    Transparency.model = model;
    Transparency.root = model.add();
  }

  static addCube(objectId) {
    const cube = Transparency.root.add("cube").opacity(0);
    cube.transId = objectId;
    Transparency.cubes[objectId] = cube;
  }

  static removeCube(objectId) {
    const cube = Transparency.cubes[objectId];
    const parentsChildren = cube._parent._children;
    const myId = cube.transId;
    for (let i = 0; i < parentsChildren.length; i++) {
      if (parentsChildren[i].transId === myId) {
        parentsChildren.splice(i, 1);
        break;
      }
    }
    delete Transparency.cubes[objectId];
  }

  static hasCube(objectId) {
    return Transparency.cubes[objectId] !== undefined;
  }

  static getCube(objectId) {
    return Transparency.cubes[objectId];
  }

  static animate() {

    // iterate over all cubes
    const cubes = Object.entries(Transparency.cubes);
    cubes.forEach(([objectId, cube]) => {
      const obj = physicsObjects[objectId];
      const objMatrix = obj.entity.getGlobalMatrix();
      cube.setMatrix(objMatrix);
      cube.move(0,0.07,0).scale(0.12, 0.12, 0.12);
    });
    
    // have the cube follow the knife
    // get knife global matrix
    // set cube matrix to knife (with offset and scale

    // do for each knife
    // this.selectBox  = this.entity.add("cube")
    //                       .move(0, .07, 0)
    //                       .scale(0.12, 0.12, 0.12)
    //                       .opacity(.25);
    
  }
}