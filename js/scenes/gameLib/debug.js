// @ts-check
import { physicsObjects } from "./objects.js";
import { enemies } from "./enemies.js";
import { printMatrix } from "../../render/core/cg.js";

export const debugLog = () => {
  printObject(2);
}

const printObject = (id) => {
  const obj = physicsObjects["" + id];
  console.log(obj.getName());
  console.log("ROOT MATRIX");
  printMatrix(obj.getMatrix());
  console.log("CHILDREN");
  const children = obj.entity._children;
  for (let i = 0; i < children.length; i++)
    printMatrix(children[i].getMatrix());
}