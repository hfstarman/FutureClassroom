// @ts-check
import { physicsObjects } from "./objects.js";
import { enemies } from "./enemies.js";
import { printMatrix } from "../../render/core/cg.js";
import { getLowestY } from "./utils.js";

export const debugLog = () => {
  console.log(getLowestY(enemies["0"].entity));
  printEntity("object", 0);
}

const printEntity = (type, id) => {
  const obj = type == "object" ? physicsObjects["" + id] : enemies["" + id];
  console.log(obj.getName());
  console.log("ROOT MATRIX");
  printMatrix(obj.getMatrix());
  console.log("CHILDREN");
  const children = obj.entity._children;
  for (let i = 0; i < children.length; i++)
    printMatrix(children[i].getMatrix());
}